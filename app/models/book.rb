class Book < ApplicationRecord
  has_many :book_selections
  has_many :book_shelves, through: :book_selections
  has_many :comments, as: :commentable
  has_many :pages
  has_many :images

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

  def generate_pages_with_gutenberg(gutenberg_id, book_id)
    page_list = []
    response = Unirest.get("https://gutenbergapi.org/texts/#{gutenberg_id}/body")
    text = response.body["body"]
    lines = []
    text.each_line {|line| lines << line}
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

  def generate_ocr_pages(text)
    lines = text.split("\n")
    number_of_pages = lines.length / 40 + 1
    line_list = []
    page_number = 1
    line_number = 0
    number_of_pages.times do
      page = Page.create(
        book_id: id,
        page_number: page_number
      )
      40.times do
        break if lines[line_number] == nil
        line = Line.new(
          text: lines[line_number],
          page_id: page.id,
          line_number: line_number + 1
        )
        line_number += 1
        line_list << line
      end
      page_number += 1
    end

    return line_list
  end

  def cover_image
    images.find_by(cover: true) ? 
      images.find_by(cover: true).image 
      : Image.find_by(name: "default").image
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
      comments: comments.as_json,
      cover_image: cover_image 
    }
  end
end

