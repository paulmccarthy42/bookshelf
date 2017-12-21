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
    number = params["gutenberg_id"]
    response = Unirest.get("https://gutenbergapi.org/texts/#{number}")

    book = Book.new
    book.title = response.body["metadata"]["title"][0]
    book.author = response.body["metadata"]["author"][0]
    book.genre = "Test Genre"
    book.language = response.body["metadata"]["language"][0]
    book.published_year = 2525
    if book.save
      render json: book.as_json
    else
      render json: "NOOOOOOOO!!!"
    end
  end
end
