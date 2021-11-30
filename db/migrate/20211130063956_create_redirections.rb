# frozen_string_literal: true

class CreateRedirections < ActiveRecord::Migration[6.1]
  def change
    create_table :redirections do |t|
      t.string :from, null: false, index: { unique: true }
      t.string :to, null: false
      t.timestamps
    end
  end
end
