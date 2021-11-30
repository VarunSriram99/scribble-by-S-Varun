# frozen_string_literal: true

class AddPasswordToSiteSetting < ActiveRecord::Migration[6.1]
  def change
    add_column :site_settings, :password_digest, :string
  end
end
