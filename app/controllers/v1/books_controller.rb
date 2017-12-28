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

  def create
    book = Book.new
    book.title = params["title"]
    book.author = params["author"]
    book.genre = params["genre"]
    book.language = params["language"]
    book.published_year = params["published_year"]
    book.gutenberg_id = params["gutenberg_id"]
    saveable = [book]
    book.generate_pages(params["gutenberg_id"], saveable)

    saveable.each do |x|
      x.save
    end



  end
end
