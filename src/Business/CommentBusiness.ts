import { CommentDatabase } from "../database/CommentDataBase"
import { PostDatabase } from "../database/PostDatabase"
import { UserDataBase } from "../database/UserDataBase"
import { CommentCreateInput, CommentCreateOutput, CommentDeleteInput, CommentsGetByPostIdInput } from "../dtos/commentDTO"
import { LikeOrDislikePostInput } from "../dtos/postDTO"
import { BadRequestError } from "../errors/BadRequestError"
import { Comment } from "../models/Comment"
import { HashManager } from "../services/HashManager"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManagerService } from "../services/TokenManager"
import { CommentCreatorDB, COMMENT_LIKE, LikeDislikeCommentDB, LikeDislikeDB, USER_ROLES } from "../types"
import { PostBusiness } from "./PostBusiness"

export class CommentBusiness {
  constructor (
    private commentDatabase: CommentDatabase,
    private userDatabase: UserDataBase,
    private postDataBase: PostDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManagerService,
    private hashManager: HashManager
  ) {}
  
  public createComments = async (input: CommentCreateInput): Promise<CommentCreateOutput> => {
    const { postId, content, token } = input

    if(!token) {
      throw new BadRequestError("Token não enviado!")
    }

    const payload = this.tokenManager.getPayloadt(token as string)

    if(payload === null) {
      throw new BadRequestError("Token inválido!")
    }

    if (typeof postId !== "string") {
      throw new BadRequestError("'postId' deve ser string")
    }

    if (typeof content !== "string") {
      throw new BadRequestError("'content' deve ser string")
    }

    const ids = this.idGenerator.generateid()

    const comments = new Comment(
      ids, postId, content, 0, 0,
      new Date().toISOString(),
      new Date().toISOString(),
      payload.id, payload.name
    )

    const commentDBs = comments.toDBModel()

    await this.commentDatabase.createComment(commentDBs)

    const outputcomment: CommentCreateOutput = {
      message: "Comentário criado com sucesso!"
    }

    return outputcomment
  }

  public getComments = async (input: CommentsGetByPostIdInput) => {
    const { postId, token } = input

    if(!token) {
      throw new BadRequestError("Token não enviado!")
    }

    const payload = this.tokenManager.getPayloadt(token as string)

    if(payload === null) {
      throw new BadRequestError("Token inválido!")
    }

    if (typeof postId !== "string") {
      throw new BadRequestError("'postId' deve ser string")
    }

    const commentsWithCreatorDB: CommentCreatorDB[] = await this.commentDatabase.getCommentWithCreatorByPostId(postId)    

    const comments = commentsWithCreatorDB.map((commentDB) => {
      const comments = new Comment(
        commentDB.id,
        commentDB.post_id,
        commentDB.content,
        commentDB.likes,
        commentDB.dislikes,
        commentDB.created_at,
        commentDB.updated_at,
        commentDB.creator_id,
        commentDB.creator_name
      )
      return comments.toBusinessModel()
    })

    return comments
  }

  public deleteComment = async (input: CommentDeleteInput) => {
    const { commentId, token } = input

    if(!token) {
      throw new BadRequestError("Token não enviado!")
    }

    const payload = this.tokenManager.getPayloadt(token as string)

    if(payload === null) {
      throw new BadRequestError("Token inválido!")
    }

    if (typeof commentId !== "string") {
      throw new BadRequestError("'commentId' deve ser string")
    }

    const commentDBid = await this.commentDatabase.getCommentById(commentId)

    if (!commentDBid) {
      throw new BadRequestError("Comentário não encontrado!")
    }
    
    if (payload.role !== USER_ROLES.ADMIN && commentDBid.creator_id !== payload.id) {
      throw new BadRequestError("Somente o criador do comentário pode deletar.")
    }

    await this.commentDatabase.deleteCommentById(commentId)

    const output = {
      message: "Comentário deletado com sucesso!"
    }

    return output
  }

  public likeOrDislikeComment = async (input: LikeOrDislikePostInput) => {
    const {idToLikeOrDislike, token, like} = input

    if(!token) {
      throw new BadRequestError("Token não enviado!")
    }

    const payloadt = this.tokenManager.getPayloadt(token as string)

    if(payloadt === null) {
      throw new BadRequestError("Usuário não logado!")
    }

    if (typeof like !== "boolean") {
      throw new BadRequestError("'like' deve ser boolean!")
    }

    const commentDB = await this.commentDatabase.getCommentById(idToLikeOrDislike)

    if (!commentDB) {
      throw new BadRequestError("Comentário não encontrado!")
    }

    const postIds = await this.commentDatabase.getIdPostByCommentId(idToLikeOrDislike);    

    const likeSQLite = like ? 1 : 0

    if (commentDB.creator_id === payloadt.id) {
      throw new BadRequestError("O criador não pode curtir seu próprio post.")
    }

    const likeDislikeDBs: LikeDislikeCommentDB = {
      user_id: payloadt.id,
      post_id: postIds[0].post_id,
      comment_id: idToLikeOrDislike,
      like: likeSQLite
    }
    
    const commentdb = new Comment(
      commentDB.id,
      commentDB.post_id,
      commentDB.content,
      commentDB.likes,
      commentDB.dislikes,
      commentDB.created_at,
      commentDB.updated_at,
      commentDB.creator_id,
      commentDB.creator_name
    )

    const likeDislikeExists = await this.commentDatabase.findLikeDislike(likeDislikeDBs)

    if (likeDislikeExists === COMMENT_LIKE.ALREADY_LIKED) {
      if (like) {
        await this.commentDatabase.removeLikeDislike(likeDislikeDBs)
        commentdb.removeLike()
      } else {
        await this.commentDatabase.updateLikeDislike(likeDislikeDBs)
        commentdb.removeLike()
        commentdb.addDislike()
      }
    } else if (likeDislikeExists === COMMENT_LIKE.ALREADY_DISLIKED) {
      if (like) {
        await this.commentDatabase.updateLikeDislike(likeDislikeDBs)
        commentdb.removeDislike()
        commentdb.addLike()
      } else {
        await this.commentDatabase.removeLikeDislike(likeDislikeDBs)
        commentdb.removeDislike()
      }
    } else {
      await this.commentDatabase.likeOrDislikeComment(likeDislikeDBs)
  
      like ? commentdb.addLike() : commentdb.addDislike()
    }

    const updatedComments = commentdb.toDBModel()

    await this.commentDatabase.editComment(idToLikeOrDislike, updatedComments)
  }

}