class CommentsController < ApplicationController
  # GET /comments?post_id=1
  def index
    if params[:post_id]
      comments = Comment.for_post(params[:post_id])
      render json: comments
    else
      render json: Comment.all.order(created_at: :desc)
    end
  end

  # POST /comments
  def create
    comment = Comment.new(comment_params)
    if comment.save
      render json: comment, status: :created
    else
      render json: { errors: comment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def comment_params
    params.require(:comment).permit(:name, :content, :post_id)
  end
end
