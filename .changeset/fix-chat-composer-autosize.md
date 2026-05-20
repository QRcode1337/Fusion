---
"@runfusion/fusion": patch
---

Fix the main chat composer (ChatView) so the textarea grows in height as the message gets longer, matching QuickChat's behavior. The autosize now runs before the controlled `setMessageInput` (so the height assignment lands in the same frame as the user's keystroke), and the height clamp now has a 40px floor so a 0-scrollHeight measurement never collapses the composer to zero.
