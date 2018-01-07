class User < ApplicationRecord
  has_secure_password
  has_many :book_shelves
  validates :name, presence: true
  validates :email, presence: true, uniqueness: true

  has_many :comments
end
