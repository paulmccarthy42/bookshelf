class BookShelf < ApplicationRecord
  has_many :book_selections
  has_many :books, through: :book_selections
  belongs_to :user

  validates :title, presence: true


  def as_json
    {
    id: id,
    user: user.name,
    title: title,
    books: books.as_json
    }
  end
end
