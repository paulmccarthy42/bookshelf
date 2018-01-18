require 'google/cloud/vision'

class V1::ImagesController < ApplicationController

  def index
    render json: Image.all.as_json
  end

  def create
    image = Image.new
    image.name = params[:name]
    image.image = params[:image]
    if image.save
      # path = "/system/images/images/000/000/004/original/LOGO.png?1516245264"
      path = "#{Rails.root}"
      url = image.image.to_s.split("?")[0]
      project_id = ENV['PROJECT_ID']
      keyfile = "./credentials.json"
      vision = Google::Cloud::Vision.new project: project_id, keyfile: keyfile
      p path + url
      words = vision.image(path + '/public/' + url).text
      render json: words
    else
      render json: "failure"
    end
  end
end
