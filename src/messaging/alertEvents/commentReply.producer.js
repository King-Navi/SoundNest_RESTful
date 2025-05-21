const { connectRabbit } = require('../../config/rabbit');

const COMMENT_REPLY_QUEUE = process.env.COMMENT_REPLY_QUEUE_NAME;

/**
 * Sends a notification when a user replies to another user's comment.
 *
 * @param {Object} params
 * @param {string} params.messageContent   - Content of the comment reply.
 * @param {string} params.senderId         - ID of the user sending the reply.
 * @param {string} params.senderName       - Name of the user sending the reply.
 * @param {string} params.recipientId      - ID of the user being replied to.
 * @param {string} params.recipientName    - Name of the user being replied to.
 */
async function alertUsersOfEventCommentReply({
  messageContent,
  senderId,
  senderName,
  recipientId,
  recipientName
}) {
  const channel = await connectRabbit();

  const payload = {
    messageContent,
    senderId,
    senderName,
    recipientId,
    recipientName,
    timestamp: new Date().toISOString()
  };

  
  await channel.assertQueue(COMMENT_REPLY_QUEUE, { durable: true });
  channel.sendToQueue(COMMENT_REPLY_QUEUE, Buffer.from(JSON.stringify(payload)), {
    persistent: true
  });
}

module.exports = { alertUsersOfEventCommentReply };