class V1::BookSelectionsController < ApplicationController
  def index
    selections = (params["book_shelf_id"] ? BookSelection.where(book_shelf_id: params[:book_shelf_id]) : BookSelection.all)
    render json: selections.as_json
  end

  def create
    selection = BookSelection.new
    selection.book_id = params["book_id"]
    selection.book_shelf_id = params["book_shelf_id"]
    if selection.save
      render json: "successfully added"
    else
      render json: "failboat"
    end
  end
end
