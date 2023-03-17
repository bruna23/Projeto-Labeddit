export interface CommentCreateInput {
    postId: string,
    content: string,
    token: string | undefined
  }
  
  export interface CommentCreateOutput {
    message: string
  }
  
  export interface CommentsGetByPostIdInput {
    postId: string,
    token: string | undefined
  }
  
  export interface CommentDeleteInput {
    commentId: string,
    token: string | undefined
  }