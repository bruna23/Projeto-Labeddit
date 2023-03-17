import { CommentDB, CommentCreatorDB, COMMENT_LIKE, LikeDislikeCommentDB, LikeDislikeDB, POST_LIKE, UserDB } from "../types";
import { BaseDatabase } from "./BaseDataBase";
import { UserDataBase } from "../database/UserDataBase";

export class CommentDatabase extends UserDataBase {
  public static TABLE_COMMENTS = "comments"
  public static TABLE_LIKES_DISLIKES_COMMENTS = "likes_dislikes_comments"

  public getCommentsByPostId = async (post_id: string): Promise<CommentDB[]> => {
    const commentsDBase = await BaseDatabase
      .connection(CommentDatabase.TABLE_COMMENTS)
      .select()
      .where({ post_id })
    return commentsDBase
  }

  getCommentWithCreatorByPostId = async (post_id: string) => {
    const resultdb: CommentCreatorDB[] = await BaseDatabase
      .connection(CommentDatabase.TABLE_COMMENTS)
      .select(
      "comments.id",
      "comments.post_id",
      "comments.creator_id",
      "comments.content",
      "comments.likes",
      "comments.dislikes",
      "comments.created_at",
      "comments.updated_at",
      "users.name AS creator_name"
    )
    
    .join("users", "comments.creator_id", "=", "users.id")
    .where({ post_id })

    return resultdb
  }

  public getCommentById = async (id: string) => {
    const [ commentDBs ]: CommentCreatorDB[] = await BaseDatabase
      .connection(CommentDatabase.TABLE_COMMENTS)
      .select()
      .where({ id })

    return commentDBs
  }

  public getIdPostByCommentId = async (id: string) => {
    const postIdDb = await BaseDatabase
      .connection(CommentDatabase.TABLE_COMMENTS)
      .select(
        "comments.post_id"       
      )
      .where({id})

    return postIdDb
  }

  public createComment = async (comment: CommentDB): Promise<void> => {
    await BaseDatabase
      .connection(CommentDatabase.TABLE_COMMENTS)
      .insert(comment)
  }

  public editComment = async (id: string, commentDB: CommentDB): Promise<void> => {
    await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
      .update(commentDB)
      .where({ id })
  }

  public deleteCommentById = async (id: string): Promise<void> => {
    await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
      .delete()
      .where({ id })
  }

  public likeOrDislikeComment = async (likeDislike: LikeDislikeCommentDB): Promise<void> => {
    await BaseDatabase.connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
      .insert(likeDislike)
  }

  public findLikeDislike = async (likeDislikeDBToFind: LikeDislikeCommentDB): Promise<any> => {
    const [ likeDislikeDBs ]: LikeDislikeDB[] = await BaseDatabase
      .connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
      .select()
      .where({
        user_id: likeDislikeDBToFind.user_id,
        comment_id: likeDislikeDBToFind.comment_id
      })

    if (likeDislikeDBs) {
      return likeDislikeDBs.like === 1
        ? COMMENT_LIKE.ALREADY_LIKED
        : COMMENT_LIKE.ALREADY_DISLIKED
    } else {
      return null
    }
  }

  public removeLikeDislike = async (likeDislikeDBToFind: LikeDislikeCommentDB): Promise<void> => {
    await BaseDatabase.connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
      .delete()
      .where({
        user_id: likeDislikeDBToFind.user_id,
        comment_id: likeDislikeDBToFind.comment_id
      })
  }

  public updateLikeDislike = async (likeDislikeDBToFind: LikeDislikeCommentDB): Promise<void> => {
    await BaseDatabase.connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
      .update(likeDislikeDBToFind)
      .where({
        user_id: likeDislikeDBToFind.user_id,
        comment_id: likeDislikeDBToFind.comment_id
      })
  }
}