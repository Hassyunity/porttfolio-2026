class CreateComments < ActiveRecord::Migration[8.0]
  def change
    create_table :comments do |t|
      t.string :name, null: false
      t.text :content, null: false
      t.integer :post_id, null: false

      t.timestamps
    end

    add_index :comments, :post_id
  end
end