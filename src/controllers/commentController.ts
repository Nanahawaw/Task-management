import { Request, Response } from 'express';
import { User } from '../models/user';
import { commentService } from '../services/commentService';
import { ErrorType } from '../utils/enum';
import { handleError } from '../utils/errorHandler';
import { Admin } from '../models/admin';

export const addComment = async (req: Request, res: Response) => {
  try {
    const taskId = parseInt(req.params.taskId, 10);
    const { content } = req.body;
    const userId = (req as Request & { user?: User }).user!.id;
    const comment = await commentService.addComment(content, userId, taskId);
    res.status(201).json(comment);
  } catch (error: any) {
    handleError(res, ErrorType.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const editComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = (req as Request & { user?: User }).user!.id;
    const comment = await commentService.editComment(
      Number(commentId),
      content,
      userId
    );
    res.json(comment);
  } catch (error: any) {
    handleError(res, ErrorType.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const commentId = parseInt(req.params.commentId, 10);
    const userId = (req as Request & { user?: User }).user!.id;
    await commentService.deleteComment(commentId, userId, false);
    res.status(201).send('Comment deleted successfully');
  } catch (error: any) {
    handleError(res, ErrorType.INTERNAL_SERVER_ERROR, error.message);
    console.log(error);
  }
};

export const adminDeleteComment = async (
  req: Request & { admin?: Admin },
  res: Response
) => {
  try {
    const commentId = parseInt(req.params.commentId, 10);
    const userId = req.admin!.id;
    await commentService.deleteComment(commentId, userId, true);
    res.status(201).send('Comment deleted successfully');
  } catch (error: any) {
    handleError(res, ErrorType.INTERNAL_SERVER_ERROR, error.message);
  }
};
