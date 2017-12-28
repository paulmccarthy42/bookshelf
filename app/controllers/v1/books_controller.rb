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
      render json: "fail"
    else

      render json: "pass"
    end
  end

  def create
    # move this gberg api pull out of controller into front end, take book inputs from user
    response = Unirest.get("https://gutenbergapi.org/texts/#{number}")
    book = Book.new
    book.title = response.body["metadata"]["title"][0]
    book.author = response.body["metadata"]["author"][0]
    book.genre = "Test Genre"
    book.language = response.body["metadata"]["language"][0]
    book.published_year = 2525
    book.gutenberg_id = number
    if book.save
      book.generate_pages(number)
      render json: book.as_json
    else
      render json: "Error creating book"

    end
  end
end
