require 'google/cloud/vision'


class V1::BooksController < ApplicationController
  def index
    books = Book.all
    render json: books.as_json
  end

  def show
    book = Book.find_by(id: params[:id])
    render json: book.as_json
  end

  def check
    number = params["gutenberg_id"] 
    existing_books = Book.where(gutenberg_id: number)
    p existing_books.length
    p params
    if existing_books.length > 0
      #move to an error reading
      render json: "fail"
    else

      render json: "pass"
    end
  end

  def read
    book = Book.find_by(id: params[:id])
    pages = book.pages.sort {|x,y| x.page_number <=> y.page_number}
    render json: {
      book: book.title,
      author: book.author,
      pages: pages.as_json}
  end

  def create
    book = Book.new
    book.title = params["title"]
    book.author = params["author"]
    book.genre = params["genre"]
    book.language = params["language"]
    book.published_year = params["published_year"]
    book.gutenberg_id = params["gutenberg_id"]
    if book.save
      pages = book.generate_pages(book.gutenberg_id, book.id)
      if pages.all? {|page| page.save}
        #move to error reporting
        render json: "success baby"
      else
        render json: "error creating pages"
        book.delete
      end
    else
      render json: "error creating book"
    end
  end

  def search
    books = []
    Book.all.each do |book|
      books << book if (book.title.downcase).include?(params[:title].downcase)
    end
    render json: books.as_json
  end

  # need to make user specific
  def bookmark_check
    bookmarked_page_number = 0
    selections = BookSelection.where(book_id: params[:id])
    if selections[0]
      bookmarked_page_number = selections[0].bookmarked_page_number
    end
    puts bookmarked_page_number
    render json: { bookmarked_page_number: bookmarked_page_number}
  end

  # need to make user specific
  def bookmark_move
    book = Book.find_by(id: params[:id])
    selections = BookSelection.where(book_id: params[:id])
    selections.each do |shelved_book|
      shelved_book.bookmarked_page_number = params[:page_number]
    end
    if selections.all? {|x| x.save}
      render json: ":)"
    else
      render json: "do not want"
    end
  end

  def upload
    path = params[:path]
    project_id = ENV['PROJECT_ID']
    keyfile = "./credentials.json"
    vision = Google::Cloud::Vision.new project: project_id, keyfile: keyfile
    p params
    words = vision.image(path).text
    render json: words

  end
end




