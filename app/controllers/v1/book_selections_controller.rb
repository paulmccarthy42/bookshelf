class V1::BookSelectionsController < ApplicationController
  def create
    selection = BookSelection.new
    selection.book_id = params["book_id"]
    selection.book_shelf_id = 1
    if selection.save
      render json: "successfully added"
    else
      render json: "failboat"
    end
  end
end
