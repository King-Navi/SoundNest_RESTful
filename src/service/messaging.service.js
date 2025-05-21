const {
  getVisualizationsBySongId,
} = require("../repositories/visualization.repository");
const {
  alertUsersOfEventSongVisits,
  alertUsersOfEventCommentReply,
} = require("../messaging/alertEvents/songVisits.producer");
const CommentRepository = require("../repositories/ComentarioRepository.mongo.repository");
const commentRepository = new CommentRepository();
const {
  alertUsersOfEventCommentReply,
} = require("../messaging/alertEvents/commentReply.producer");

/**
 * Checks the total play count for a song and sends a notification
 * every time the count reaches a multiple of 5.
 *
 * @param {Object} song
 * @param {number} song.idSong- ID of the song.
 * @param {string} song.songName- Name of the song.
 * @param {number} song.idAppUser- ID of the song’s owner.
 * @param {Object} song.idAppUser_AppUser- Associated AppUser instance.
 * @param {string} song.idAppUser_AppUser.nameUser- Name of the song’s owner.
 */
async function checkAndNotifySongVisits(song) {
  if (!song || !song.idSong) {
    throw new Error("Invalid or missing song");
  }
  const visualizations = await getVisualizationsBySongId(song.idSong);
  const totalVisits = visualizations.reduce(
    (sum, viz) => sum + (viz.playCount || 0),
    0
  );
  if (totalVisits > 0 && totalVisits % 5 === 0) {
    const { idAppUser: userId, songName, idSong: songId } = song;
    const userName = song.idAppUser_AppUser?.nameUser ?? "Unknown";

    await alertUsersOfEventSongVisits({
      userId,
      userName,
      songId,
      songName,
      visitCount: totalVisits,
    });
  }
}
/**
 * Fetches the original comment by its ID, determines the recipient (comment’s author),
 * and sends a reply notification.
 *
 * @param {Object} params
 * @param {string} params.commentId       - ID of the comment being replied to.
 * @param {number} params.senderId        - ID of the user sending the reply.
 * @param {string} params.senderName      - Name of the user sending the reply.
 * @param {string} params.messageContent  - Content of the reply message.
 */
async function notifyOnCommentReply({
  commentId,
  senderId,
  senderName,
  messageContent,
}) {
  if (!commentId) {
    throw new Error("Missing commentId");
  }
  if (!senderId || !senderName) {
    throw new Error("Missing sender information");
  }
  if (!messageContent) {
    throw new Error("Missing messageContent");
  }

  const originalComment = await commentRepository.getRawCommentById(commentId);
  if (!originalComment) {
    throw new Error(`Original comment with ID ${commentId} not found`);
  }

  const recipientId = originalComment.author_id;
  const recipientName = originalComment.user;

  await alertUsersOfEventCommentReply({
    messageContent,
    senderId,
    senderName,
    recipientId,
    recipientName,
  });
}

module.exports = { checkAndNotifySongVisits, notifyOnCommentReply };
