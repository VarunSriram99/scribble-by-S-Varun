# frozen_string_literal: true

class CreateCategories < ActiveRecord::Migration[6.1]
  def change
    create_table :categories do |t|
      t.string :name, null: false, index: { unique: true }
      t.integer :order, null: false
      t.timestamps
    end
  end
end
