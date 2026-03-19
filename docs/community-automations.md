# `contributor-issue-comment`

Manages GitHub issue comments. Sends Slack notifications and GitHub bot replies.

| Contributor type | Issue type | Comment type | #support-dev | #support-dev-notifications | GitHub bot | GitHub bot message |
|------------------|------------|--------------|--------------|---------------------------|------------------|-------------|
| **Core team** | Any | Any | No | No | No | - |
| **Close contributor** | Any | Any | **Yes** | No | No | - |
| **Issue creator** | `help-wanted` | Any | **Yes** | No | No | - |
| **Issue creator** | Private | Any | No | Yes | No | - |
| **Other** | Private | Regular | No | Yes | No | - |
| **Other** | Private | Assignment request | No | Yes | Yes`*` | `BOT_MESSAGE_ISSUE_NOT_OPEN` |
| **Other** | Unassigned `help-wanted` | Any | **Yes** | No | No | - |
| **Other** | `help-wanted` assigned to the comment author | Any | **Yes** | No | No | - |
| **Other** | `help-wanted` assigned to someone else | Regular | No | Yes | No | - |
| **Other** | `help-wanted` assigned to someone else | Assignment request | No | Yes | Yes`*` | `BOT_MESSAGE_ALREADY_ASSIGNED` |

`*` There is an additional optimization that prevents more than one bot message per hour to not overwhelm issue comment section

In `scripts/contants.js` set:
- `BOT_MESSAGE_ISSUE_NOT_OPEN`: _Issue not open for contribution_ message text
- `BOT_MESSAGE_ALREADY_ASSIGNED`: _Issue already assigned_ message text

## `/assign` self-assignment

When a contributor comments `/assign` (exact match, trimmed) on an issue:

| Issue state | Action | Bot message | Slack |
|-------------|--------|-------------|-------|
| Not `help wanted` | Decline | `BOT_MESSAGE_ISSUE_NOT_OPEN` | `#support-dev-notifications` |
| `help wanted` + assigned to commenter | No-op | - | - |
| `help wanted` + assigned to someone else | Decline | `BOT_MESSAGE_ALREADY_ASSIGNED` | `#support-dev-notifications` |
| `help wanted` + NOT `good first issue` | Decline | `BOT_MESSAGE_ASSIGN_NOT_GOOD_FIRST_ISSUE` | `#support-dev-notifications` |
| `help wanted` + `good first issue` + at limit | Decline | Dynamic message with assignments and cooldowns | `#support-dev-notifications` |
| `help wanted` + `good first issue` + under limit | Assign | `BOT_MESSAGE_ASSIGN_SUCCESS` | `#support-dev-notifications` |

**Cross-repo limit:** Contributors can have up to 2 assigned issues across all community repos (`COMMUNITY_REPOS`).

**7-day cooldown:** Issues unassigned within the last 7 days count toward the limit. The limit check is: `currentAssignments + recentUnassignments >= MAX_ASSIGNED_ISSUES`.

**Slack notifications:** All `/assign` activity goes to `#support-dev-notifications` only. It does not trigger `#support-dev` notifications.

## Keyword detection on `good first issue` issues

When existing keyword detection triggers on an unassigned `good first issue` issue, the bot reply includes guidance about the `/assign` command (`BOT_MESSAGE_KEYWORD_GOOD_FIRST_ISSUE`) instead of the normal no-reply behavior.

In `scripts/constants.js` set:
- `BOT_MESSAGE_ASSIGN_SUCCESS`: Assignment confirmation message
- `BOT_MESSAGE_ASSIGN_NOT_GOOD_FIRST_ISSUE`: Decline message for non-GFI issues
- `BOT_MESSAGE_KEYWORD_GOOD_FIRST_ISSUE`: Keyword reply with `/assign` guidance

# `good-first-issue-comment`

Posts a guidance comment when the `good first issue` label is applied to an issue (triggered via the `manage-issue-header` workflow). Explains the `/assign` command, issue limits, cooldown, and links to contributing guidelines.

- Only posts if the issue also has `help wanted` label
- Deletes any previous guidance comment from the bot before posting a new one
- Identified by the `<!-- ASSIGN_GUIDANCE -->` HTML comment marker

In `scripts/constants.js` set:
- `BOT_MESSAGE_GOOD_FIRST_ISSUE_GUIDANCE`: Guidance message text

# `contributor-pr-reply`

Sends reply to a community pull requests.

In `scripts/contants.js` set:
- `BOT_MESSAGE_PULL_REQUEST`: Message text

# `holiday-message`

Sends a holiday message to community pull requests and issue comments.

In `scripts/contants.js` set:
- `HOLIDAY_MESSAGE`: Message text

Before/after holidays, enable/disable all related workflows in all repositories that use it (search for `call-holiday-message`).
