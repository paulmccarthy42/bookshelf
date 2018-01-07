class Page < ApplicationRecord
  belongs_to :book
  has_many :lines
  belongs_to

  def display
    pretty_page = ""
    pretty_page += text
    pretty_page += "\n"
    pretty_page += "Page #{page_number}"
    pretty_page += "\n"
    return pretty_page
  end
  

  def test(message)
    puts message
  end

  def as_json
    {
      book: book.title,
      text: text,
      page_number: page_number,
      book_id: book_id,
      lines: lines.order(:line_number)
    }
  end
end
