class CreateCommentsTable < ActiveRecord::Migration[5.1]
  def change
    create_table :comments_tables do |t|
      t.integer :commentable_id
      t.string :commentable_type
      t.string :comment
      t.integer :user_id

      t.timestamps
    end
  end
end
