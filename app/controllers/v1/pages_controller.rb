class V1::PagesController < ApplicationController
  def index
    pages = Page.all
    render json: pages.as_json
  end

  def show
    page = Page.find_by(id: params[:id])
    render json: page.as_json
  end

  def read
    page = Page.where(book_id: params[:book_id]).find_by(page_number: params[:page_number])
    render json: page.display
  end

  def create
    page = Page.new
    page.book_id = params[:book_id]
    page.text = params[:text]
    page.page_number = params[:page_number]
    #move page saving 
    if page.save
      render json: page.as_json
    else
      render json: "Error creating page"
    end
  end


end

