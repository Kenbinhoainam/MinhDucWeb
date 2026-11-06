# Website Minh Đức — project instructions

<!-- postman-cli:installation:start -->
Postman CLI is installed on this device, and can be used for API Engineering work.
<!-- postman-cli:installation:end -->

## Automatic agent delegation (quality first)

The user explicitly authorizes automatic delegation to subagents and automatic model selection for work in this project. Apply these instructions in future project chats as well. The primary agent owns requirements, integration, validation, and the final result.

- For substantial features, ambiguous bugs, or changes spanning multiple areas, delegate bounded independent work without asking again. Use at most three subagents concurrently (four agents including the primary), subject to runtime limits. Simple edits may be handled directly.
- Assign each agent a concrete outcome, relevant context, owned files, constraints, and validation expectations. Prefer parallel exploration and review; allow parallel edits only in disjoint files. Never overwrite another agent's or the user's work.
- Subagents must not recursively delegate unless the primary explicitly requests it. Wait for required results, assess findings, resolve conflicts, and integrate before declaring completion.

## Model routing

Select the model and reasoning effort explicitly when spawning an agent. Use only models available in the current runtime; these are preferences, not guarantees of account access.

| Work | Preferred model | Reasoning |
| --- | --- | --- |
| Narrow file discovery, inventory, straightforward summaries | gpt-6-luna | high |
| Feature implementation, UI, API integration, database work, ordinary debugging | gpt-6.1-sol | high |
| Difficult architecture, subtle concurrency/data integrity issues, unresolved complex bugs | gpt-6-astra | high |
| Independent review of substantial changes, security, regression analysis | gpt-6.1-sol | high |

- Prioritize correctness over token savings. Do not assign ambiguous implementation or security decisions to the lightweight model.
- Escalate incomplete, contradictory, or poorly supported results to Sol or Astra with a concise handoff. Do not repeat an unsuccessful approach indefinitely. To change models, create a replacement agent; do not claim to switch a running agent's model.
- If a preferred model is unavailable, use an available model of comparable capability or inherit the primary model. Disclose material limitations. Do not change the primary chat model or global account settings.

## Quality gates

- Inspect existing project conventions and available scripts before changing code.
- For substantial or sensitive changes, obtain an independent agent review after implementation. Fix actionable findings and validate the final integrated changes.
- Run checks appropriate to the affected behavior. Cover authentication, permissions, validation, and data integrity when touched. For UI changes inspect responsive layout and key interaction states using available tools.
- Do not write redundant tests for trivial edits. Do not claim checks passed unless they were actually run. Report remaining risks or blocked checks plainly.
- Delegation does not expand authorization for deployment, destructive operations, external messages, secrets, or account settings.
