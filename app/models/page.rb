class Page < ApplicationRecord
  belongs_to :book

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
end
