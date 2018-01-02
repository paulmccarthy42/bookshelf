class V1::BookShelvesController < ApplicationController
  def index
    book_shelves = BookShelf.where(user_id: params[:user_id])
    p book_shelves
    render json: book_shelves.as_json
  end

  def show
    book_shelf = BookShelf.find_by(id: params[:id])
    render json: book_shelf.as_json
  end

  def create
    book_shelf = BookShelf.new
    book_shelf.title = params["title"]
    book_shelf.user_id = params["user_id"]
    book_shelf.public = false
    if book_shelf.save
      render json: book_shelf.as_json
    else
      render json: {errors: book_shelf.errors.full_messages}, status: :bad_request
    end
  end


end
