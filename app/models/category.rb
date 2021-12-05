# frozen_string_literal: true

class Category < ApplicationRecord
  validates :name, presence: true, uniqueness: { case_sensitive: false }

  before_create :add_order_number

  has_many :articles, dependent: :nullify

  private

    def add_order_number
      max_order = Category.maximum("order")
      self.order = max_order ? max_order + 1 : 1
    end
end
