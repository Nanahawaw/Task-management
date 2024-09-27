import { Comment } from '../models/comment';

class CommentService {
  async addComment(
    content: string,
    userId: number,
    taskId: number
  ): Promise<Comment> {
    return await Comment.query().insert({ content, userId, taskId });
  }

  async editComment(
    commentId: number,
    content: string,
    userId: number
  ): Promise<Comment> {
    const comment = await Comment.query().findById(commentId);
    if (!comment) throw new Error('Comment not found');
    if (comment.userId !== userId)
      throw new Error('Not authorized to edit this comment');
    return await comment.$query().patchAndFetch({ content });
  }

  async deleteComment(
    commentId: number,
    userId: number,
    isAdmin: boolean
  ): Promise<void> {
    const comment = await Comment.query().findById(commentId);
    if (!comment) throw new Error('Comment not found');
    if (!isAdmin && comment.userId !== userId)
      throw new Error('Not authorized to delete this comment');
    await Comment.query().deleteById(commentId);
  }
}

export const commentService = new CommentService();
