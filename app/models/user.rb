class User < ApplicationRecord
  has_secure_password
  has_many :book_shelves
  validates :name, presence: true
  validates :email, presence: true, uniqueness: true

  has_many :comments

  def last_read_book
    books = []
    book_shelves.each do |shelf|
      shelf.book_selections.each {|book| books << book}
    end
    books.sort! {|x, y| y.updated_at <=> x.updated_at}
    return books[0]
  end

  def as_json
    {
      name: name,
      role: role,
      email: email,
      last_read_book: last_read_book
    }
  end
end