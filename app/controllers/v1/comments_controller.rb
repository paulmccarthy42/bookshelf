class V1::CommentsController < ApplicationController
  def create
    comment = Comment.new
    comment.comment = params[:comment]
    comment.user_id = current_user.id
    comment.commentable_id = params[:id]
    comment.commentable_type = params[:commented]
    p comment
    if comment.save
      render json: comment.as_json
    else
      render json: {errors: comment.errors.full_messages}, status: :bad_request
    end
  end
end
