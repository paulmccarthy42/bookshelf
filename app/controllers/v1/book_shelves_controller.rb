class V1::BookShelvesController < ApplicationController
  def show
    book_shelf = BookShelf.find_by(id: params[:id])
    render json: book_shelf.as_json
  end
end
