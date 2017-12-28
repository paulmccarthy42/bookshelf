class AddPageNumberToPage < ActiveRecord::Migration[5.1]
  def change
    add_column :pages, :page_number, :integer
  end
end

