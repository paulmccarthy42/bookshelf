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

  def generate_pages(gutenberg_id)
    response = Unirest.get("https://gutenbergapi.org/texts/#{gutenberg_id}/body")
    lines = []
    response.body["body"].each_line {|line| lines << line}
    pages = lines.length / 40 + 1
    40.times do 
      lines << []
    end
    page_number = 1
    page_start = 0
    page_end = 40
    for x in 0..pages
      params = {
        book_id: id,
        page_number: page_number,
        text: lines[page_start..page_end].join()
      }
      response = Unirest.post("localhost:3000/v1/pages", parameters: params)
      page_number += 1
      page_start += 40
      page_end += 40 
    end
  end

  def as_json
    {
      id: id,
      title: title,
      author: author,
      genre: genre,
      language: language,
      published_year: published_year,
      pages: pages.length
    }
  end
end
