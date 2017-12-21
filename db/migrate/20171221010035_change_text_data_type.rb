class ChangeTextDataType < ActiveRecord::Migration[5.1]
  def change
    change_column :pages, :text, :text
  end
end
