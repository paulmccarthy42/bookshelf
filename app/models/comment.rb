class Comment < ApplicationRecord
  belongs_to :commentable, polymorphic: true
  belongs_to :user
  has_many :comments, as: :commentable

  def as_json
    return {
      id: id,
      comment_text: comment,
      author: user.name
      #find a way to add subcomments in a way that doesn't break activerecord
    }
  end
end