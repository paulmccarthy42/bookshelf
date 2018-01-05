class CreateLines < ActiveRecord::Migration[5.1]
  def change
    create_table :lines do |t|
      t.integer :page_id
      t.integer :line_number
      t.string :text

      t.timestamps
    end
  end
end
