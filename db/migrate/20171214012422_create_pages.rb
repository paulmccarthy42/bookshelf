class CreatePages < ActiveRecord::Migration[5.1]
  def change
    create_table :pages do |t|
      t.integer :book_id
      t.string :text
      t.string :image

      t.timestamps
    end
  end
end
