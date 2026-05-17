import { execFile } from "node:child_process";
import { chmod, mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export const DEFAULT_ALLOWED_BRANCH_PATTERNS = ["^fusion/step-\\d+-[a-z0-9-]+$"] as const;

function toShellCasePattern(pattern: string): string {
  return pattern
    .replace(/^\^/, "")
    .replace(/\$$/, "")
    .replace(/\\d\+/g, "[0-9]*")
    .replace(/\[a-z0-9-\]\+/g, "[a-z0-9-]*");
}

export function buildIdentityGuardHook(taskId: string, allowedBranchPatterns: readonly string[] = DEFAULT_ALLOWED_BRANCH_PATTERNS): string {
  const allowChecks = allowedBranchPatterns
    .map((pattern) => `  ${toShellCasePattern(pattern)}) exit 0 ;;`)
    .join("\n");

  return `#!/bin/sh
set -eu

GIT_DIR=$(git rev-parse --git-dir)
TASK_FILE="$GIT_DIR/fusion-task-id"

if [ ! -f "$TASK_FILE" ]; then
  exit 0
fi

WORKTREE_TASK_ID=$(cat "$TASK_FILE")
EXPECTED_BRANCH="fusion/${taskId.toLowerCase()}"

if ! HEAD_BRANCH=$(git symbolic-ref --quiet --short HEAD 2>/dev/null); then
  HEAD_BRANCH="detached"
fi

if [ "$WORKTREE_TASK_ID" != "${taskId}" ] && [ "$WORKTREE_TASK_ID" != "${taskId.toLowerCase()}" ]; then
  EXPECTED_BRANCH="fusion/$WORKTREE_TASK_ID"
fi

if [ "$HEAD_BRANCH" = "$EXPECTED_BRANCH" ]; then
  exit 0
fi

case "$HEAD_BRANCH" in
${allowChecks}
esac

printf '%s\n' "fusion: refusing commit — worktree owns $WORKTREE_TASK_ID but HEAD is $HEAD_BRANCH" >&2
exit 1
`;
}

async function resolveGitDir(worktreePath: string): Promise<string> {
  try {
    const { stdout } = await execFileAsync("git", ["rev-parse", "--git-dir"], {
      cwd: worktreePath,
      encoding: "utf-8",
    });
    return resolve(worktreePath, stdout.trim());
  } catch (error) {
    throw new Error(`Failed to resolve git dir for worktree ${worktreePath}: ${(error as Error).message}`);
  }
}

async function writeFileAtomic(targetPath: string, content: string, mode?: number): Promise<void> {
  await mkdir(dirname(targetPath), { recursive: true });
  const tmpPath = `${targetPath}.tmp`;
  const current = await readFile(targetPath, "utf-8").catch(() => null);
  if (current === content) {
    if (mode != null) {
      await chmod(targetPath, mode);
    }
    return;
  }
  await writeFile(tmpPath, content, { encoding: "utf-8", mode });
  if (mode != null) {
    await chmod(tmpPath, mode);
  }
  await rename(tmpPath, targetPath);
}

export async function installTaskWorktreeIdentityGuard(input: {
  worktreePath: string;
  taskId: string;
  allowedBranchPatterns?: readonly string[];
}): Promise<void> {
  const gitDir = await resolveGitDir(input.worktreePath);
  const guard = buildIdentityGuardHook(input.taskId, input.allowedBranchPatterns ?? DEFAULT_ALLOWED_BRANCH_PATTERNS);

  const metadataPath = resolve(gitDir, "fusion-task-id");
  const hookPath = resolve(gitDir, "hooks", "pre-commit");

  await writeFileAtomic(metadataPath, `${input.taskId}\n`);
  await writeFileAtomic(hookPath, guard, 0o755);

  const hookStat = await stat(hookPath);
  if ((hookStat.mode & 0o111) === 0) {
    await chmod(hookPath, 0o755);
  }
}
