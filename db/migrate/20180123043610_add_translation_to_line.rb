class AddTranslationToLine < ActiveRecord::Migration[5.1]
  def change
    add_column :lines, :translation, :string

  end
end
