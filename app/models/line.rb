class Line < ApplicationRecord
  validates :line_number, presence: true
  has_many :comments, as: :commentable
  belongs_to :page

  def as_json
    {
      page_id: page_id,
      line_number: line_number,
      text: text,
      comments: comments.as_json
    }
  end
end
