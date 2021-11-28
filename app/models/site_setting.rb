# frozen_string_literal: true

class SiteSetting < ApplicationRecord
  validates :name, presence: true
end
