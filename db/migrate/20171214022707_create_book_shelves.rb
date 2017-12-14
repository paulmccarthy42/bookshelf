class CreateBookShelves < ActiveRecord::Migration[5.1]
  def change
    create_table :book_shelves do |t|
      t.string :title
      t.integer :user_id
      t.boolean :public

      t.timestamps
    end
  end
end
