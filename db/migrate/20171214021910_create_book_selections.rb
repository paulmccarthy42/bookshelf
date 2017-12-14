class CreateBookSelections < ActiveRecord::Migration[5.1]
  def change
    create_table :book_selections do |t|
      t.integer :book_id
      t.integer :bookshelf_id

      t.timestamps
    end
  end
end
