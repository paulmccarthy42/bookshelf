class ChangeNameOfBookShelfId < ActiveRecord::Migration[5.1]
  def change
    add_column :book_selections, :book_shelf_id, :integer
    remove_column :book_selections, :bookshelf_id, :integer
  end
end
