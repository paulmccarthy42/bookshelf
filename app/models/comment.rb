class Comment < ApplicationRecord
  belongs_to :commentable, polymorphic: true
  belongs_to :user
  has_many :comments, as: :commentable

  def as_json
    return {
      id: id,
      comment_text: comment,
      author: user.name,
      subcomments: comments.as_json
    }
  end
end