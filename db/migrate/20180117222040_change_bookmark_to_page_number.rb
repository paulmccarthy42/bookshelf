class ChangeBookmarkToPageNumber < ActiveRecord::Migration[5.1]
  def change
    rename_column :book_selections, :bookmarked_page_id, :bookmarked_page_number
  end
end
