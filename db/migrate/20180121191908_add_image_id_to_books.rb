class AddImageIdToBooks < ActiveRecord::Migration[5.1]
  def change
    #misnamed, adding book id to images
    add_column :images, :book_id, :integer
    add_column :images, :cover, :boolean

  end
end
