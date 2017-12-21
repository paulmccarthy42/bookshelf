class BookSelection < ApplicationRecord
  belongs_to :book_shelf
  belongs_to :book
end
