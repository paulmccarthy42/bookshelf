class BookShelf < ApplicationRecord
  has_many :book_selections
  has_many :books, through: :book_selections
  belongs_to :user

  def as_json
    {
    user: User.find_by(id: user_id).name,
    title: title,
    books: books.as_json
    }
  end
end
