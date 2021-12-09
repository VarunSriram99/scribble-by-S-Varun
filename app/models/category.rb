# frozen_string_literal: true

class Category < ApplicationRecord
  validates :name, presence: true, uniqueness: { case_sensitive: false }
  validates :order, presence: true

  before_validation :add_order_number, on: :create # TODO: Why should this be before_validation? Could've made this before_save right?

  has_many :articles, dependent: :nullify

  private

    def add_order_number
      max_order = Category.maximum("order")
      self.order = max_order ? max_order + 1 : 1
    end
end
