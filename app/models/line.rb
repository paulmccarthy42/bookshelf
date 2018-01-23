class Line < ApplicationRecord
  validates :line_number, presence: true
  has_many :comments, as: :commentable
  belongs_to :page

  def as_json
    {
      id: id,
      page_id: page_id,
      line_number: line_number,
      text: text,
      translation: translation,
      comments: comments.as_json
    }
  end
end
