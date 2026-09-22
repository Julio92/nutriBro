### Create task in backlog

First, read [tasks/task-template.md](tasks/task-template.md) and [tasks/backlog.md](tasks/backlog.md).

I want you to create a new task in the backlog, strictly following the format specified in task-template.md.

Notes:
- If a blocker arises, mark it as “Blocked” and document the cause.
- Before editing code, the agent must explain the implementation plan.
Instructions:
1. Review the existing backlog to avoid duplicating IDs or similar tasks.
2. Assign the next available ID in the T-XXX format.
3. Choose the appropriate priority: High, Medium, or Low.
4. Keep the scope specific; do not expand the project.
5. Write the task ALWAYS in English.
6. Finally, edit [tasks/backlog.md](tasks/backlog.md) directly by adding the new task to the end of the file.
7. Do not change any other part of the repository except as necessary to complete this task.
The new task I want to create is this:
[DESCRIBE YOUR IDEA HERE IN NATURAL LANGUAGE]

### Implement task from backlog

Read the repository and the active task in backlog.md.

Follow the rules in AGENTS.md and copilot-instructions.md.

If there are multiple tasks, choose the one with the “In Progress” status or, if none has that status, the one with status "New" and the highest available priority and a clearly defined scope.
Do not start a new task if the current task has not been closed.
Before touching any code, explain your implementation plan, which files you’ll review, and which validations you’ll run.
Then implement only what’s necessary to complete that task.
Stick strictly to the scope and don’t expand it without documenting the change.
When finished, run `npm run check` and update the task’s status in backlog.txt to “Done,” “Review,” or “Blocked” depending on the result.