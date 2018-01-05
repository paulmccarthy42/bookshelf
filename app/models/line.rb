class Line < ApplicationRecord
  validates :line_number, presence: true

  belongs_to :page
end
