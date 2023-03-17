import { Request, Response } from "express"
import { CommentBusiness } from "../business/CommentBusiness"
import { CommentCreateInput } from "../dtos/commentDTO"
import { BaseError } from "../errors/BaseError"

export class CommentController {
  constructor (
    private commentBusiness: CommentBusiness
  ){}

  public createComments = async (req: Request, res: Response) => {
    try {
      const inputs: CommentCreateInput = {
        postId: req.params.id,
        content: req.body.content,
        token: req.headers.authorization
      }

      const outputs = await this.commentBusiness.createComments(inputs)

      res.status(201).send(outputs)

    } catch (error) {
      console.log(error)

      if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }

  public getComments = async (req: Request, res: Response) => {
    try {
      const inputs = {
        postId: req.params.id,
        token: req.headers.authorization
      }

      const outputs = await this.commentBusiness.getComments(inputs)

      res.status(200).send(outputs)

    } catch (error) {
      console.log(error)

      if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }

  public deleteComment = async (req: Request, res: Response) => {
    try {
      const inputs = {
        commentId: req.params.id,
        token: req.headers.authorization
      }

      const outputs = await this.commentBusiness.deleteComment(inputs)

      res.status(200).send(outputs)

    } catch (error) {
      console.log(error)

      if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }

  public likeOrDislikeComment = async (req: Request, res: Response) => {
    try {
      const inputs = {
        idToLikeOrDislike: req.params.id,
        token: req.headers.authorization,
        like: req.body.like
      }

      const outputs = await this.commentBusiness.likeOrDislikeComment(inputs)

      res.status(200).send(outputs)

    } catch (error) {
      console.log(error)

      if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }
}