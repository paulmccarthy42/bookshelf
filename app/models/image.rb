class Image < ApplicationRecord
  has_attached_file :image
    
  validates_attachment :image,
    content_type: {
      content_type: ["image/jpeg", "image/gif", "image/png"]
    }

  def as_json
    {
      image: image,
      string: image.to_s
    }
  end
end
