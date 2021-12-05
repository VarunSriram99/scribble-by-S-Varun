# frozen_string_literal: true

module Formattable
  extend ActiveSupport::Concern

  def format_reorder(categories)
    ids = []
    orders = []
    category_params["reorder"].each do |category|
      ids.push(category[:id])
      orders.push({ order: category[:order] })
    end
    [ids, orders]
  end
end
