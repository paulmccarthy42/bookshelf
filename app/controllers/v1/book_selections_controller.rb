class V1::BookSelectionsController < ApplicationController
  def index
    selections = (params["book_shelf_id"] ? BookSelection.where(book_shelf_id: params[:book_shelf_id]) : BookSelection.all)
    render json: selections.as_json
  end

  def create
    selection = BookSelection.new
    selection.book_id = params["book_id"]
    selection.book_shelf_id = params["book_shelf_id"] || BookShelf.find_by(title: params["book_shelf_title"]).id
    selection.bookmarked_page_id = 0
    if selection.save
      render json: selection.as_json
    else
      render json: {errors: selection.errors.full_messages}, status: :bad_request
      
    end
  end

end
