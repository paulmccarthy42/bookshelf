class Book < ApplicationRecord
  has_many :book_selections
  has_many :book_shelves, through: :book_selections
  has_many :comments, as: :commentable

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

  def generate_pages(gutenberg_id, book_id)
    page_list = []
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
      page = Page.new(
        book_id: book_id,
        page_number: page_number,
        text: lines[page_start..page_end].join()
      )
      page_list << page
      page_number += 1
      page_start += 40
      page_end += 40 
    end
    return page_list
  end

  def generate_pages_line_by_line
    response = Unirest.get("https://gutenbergapi.org/texts/#{self.gutenberg_id}/body").body["body"]
    lines = []
    response.each_line {|line| lines << line}
    # generate a page
    # save it
    # generate 40 lines tied to that page
    # save them
    page_number = 1
    pages = lines.length / 40 + 1
    # pages.times do
    page = Page.new(
      book_id: self.id,
      page_number: page_number
    )
    page.save
    40.times do
      line = Line.new(
        page_id: page.id,
        line_number: lines.index(line) + 1,
        text: line
        )
      line.save

    end
    page_number += 1
  # end

  end

  def as_json
    {
      id: id,
      title: title,
      author: author,
      genre: genre,
      language: language,
      published_year: published_year,
      pages: pages.length,
      comments: comments.as_json
    }
  end
end
