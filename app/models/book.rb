class Book < ApplicationRecord
  has_many :book_selections
  has_many :book_shelves, through: :book_selections

  def pages
    Page.all.where(book_id: id).sort{|page1, page2| page1.page_number <=> page2.page_number}
  end

  def flip_to_page(num)
    Page.find_by(page_number: num)
  end

  def read
    pages.each do |page| 
      puts page.display
      puts
      puts
    end
  end
end
