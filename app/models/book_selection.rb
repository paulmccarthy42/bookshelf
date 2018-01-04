class BookSelection < ApplicationRecord
  belongs_to :book_shelf
  belongs_to :book

  def as_json
    {
      id: id,
      book_id: book_id,
      book_title: book.title,
      book_shelf_id: book_shelf_id,
      bookmarked_page_id: bookmarked_page_id
    }
  end
end
