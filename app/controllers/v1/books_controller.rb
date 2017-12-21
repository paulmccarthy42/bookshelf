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
end
