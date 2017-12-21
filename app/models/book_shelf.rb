class BookShelf < ApplicationRecord
  has_many :book_selections
  has_many :books, through: :book_selections
  belongs_to :user
end
