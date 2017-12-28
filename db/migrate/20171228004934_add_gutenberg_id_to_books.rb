class AddGutenbergIdToBooks < ActiveRecord::Migration[5.1]
  def change
    add_column :books, :gutenberg_id, :integer
  end
end
