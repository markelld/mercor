class CreateBookmarks < ActiveRecord::Migration[8.1]
  def change
    create_table :bookmarks do |t|
      t.string :title, null: false
      t.string :url, null: false
      t.text :description
      t.text :tags, array: true, default: []

      t.timestamps
    end

    add_index :bookmarks, :tags, using: :gin
  end
end
