class AddBookmarkToBookSelections < ActiveRecord::Migration[5.1]
  def change
    add_column :book_selections, :bookmarked_page_id, :integer
  end
end
