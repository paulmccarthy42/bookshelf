class V1::BooksController < ApplicationController
  def show
    book = Book.find_by(id: params[:id])
    display = ""
    book.pages.each do |page|
      display += page.display
      display += "-"*150
      display += "\n"
    end
    render json: display
  end

  def create
    book = Book.new
    book.title = params[:title]
    book.author = params[:author]
    book.genre = "Test Genre"
    book.language = params[:language]
    book.published_year = 2525
    if book.save
      render json: book.as_json
    else
      render json: "NOOOOOOOO!!!"
    end
  end
end
