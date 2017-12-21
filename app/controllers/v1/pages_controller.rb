class V1::PagesController < ApplicationController
  def index
    pages = Page.all
    render json: pages.as_json
  end

  def show
    page = Page.find_by(id: params[:id])
    render json: page.display
  end

  def create
    page = Page.new
    page.book_id = params[:book_id]
    page.text = params[:text]
    page.page_number = params[:page_number]
    if page.save
      render jsn: page.as_json
    else
      render json: "Error creating page"
    end
  end


end

