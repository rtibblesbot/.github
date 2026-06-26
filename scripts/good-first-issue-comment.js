// See docs/community-automations.md

const {
  LE_BOT_USERNAME,
  ISSUE_LABEL_HELP_WANTED,
  ISSUE_LABEL_GOOD_FIRST_ISSUE,
  ASSIGN_GUIDANCE_MARKER,
  BOT_MESSAGE_GOOD_FIRST_ISSUE_GUIDANCE,
} = require('./constants');
const { sendBotMessage, deleteBotComments } = require('./utils');

module.exports = async ({ github, context, core }) => {
  try {
    const owner = context.repo.owner;
    const repo = context.repo.repo;
    const issueNumber = context.payload.issue.number;

    const labelNames = (context.payload.issue.labels || []).map(l => l.name.toLowerCase());
    const isHelpWanted = labelNames.includes(ISSUE_LABEL_HELP_WANTED);
    const isGoodFirstIssue = labelNames.includes(ISSUE_LABEL_GOOD_FIRST_ISSUE);

    if (!isHelpWanted || !isGoodFirstIssue) {
      core.info(`Issue #${issueNumber} missing 'help wanted' or 'good first issue' label`);
      return;
    }

    // Delete any previous guidance comments
    await deleteBotComments(
      issueNumber,
      LE_BOT_USERNAME,
      ASSIGN_GUIDANCE_MARKER,
      owner,
      repo,
      github,
      core,
    );

    // Post new guidance comment
    await sendBotMessage(issueNumber, BOT_MESSAGE_GOOD_FIRST_ISSUE_GUIDANCE, {
      github,
      context,
      core,
    });

    core.info(`Posted guidance comment on issue #${issueNumber}`);
  } catch (error) {
    core.setFailed(`Error: ${error.message}`);
  }
};
