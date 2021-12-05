  # frozen_string_literal: true

  class Api::CategoriesController < ApplicationController
    before_action :load_category, only: %i[update destroy]
    skip_before_action :verify_authenticity_token
    include Formattable

    def index
      categories = Category.all
      render status: :ok, json: { "Categories": categories }
    end

    def create
      category = Category.new(category_params)
      if category.save!
        render status: :ok, json: { notice: t("successfully_created", entity: "Category") }
      else
        error = category.errors.full_messages.to_sentence
        render status: :unprocessable_entity, json: { error: error }
      end
    end

    def update
      if @category.update!(category_params)
        render status: :ok, json: { notice: t("successfully_updated", entity: "Category") }
      else
        error = category.errors.full_messages.to_sentence
        render status: :unprocessable_entity, json: { error: error }
      end
    end

    def reorder
      ids, orders = format_reorder(category_params["reorder"])
      if Category.update(ids, orders)
        render status: :ok, json: { message: "success" }
      else
        error = category.errors.full_messages.to_sentence
        render status: :unprocessable_entity, json: { error: error }
      end
    end

    def destroy
      if @category.destroy
        render status: :ok, json: { notice: t("successfully_destroyed", entity: "Category") }
      else
        error = category.errors.full_messages.to_sentence
        render status: :unprocessable_entity, json: { error: error }
      end
    end

    private

      def category_params
        params.require(:category).permit(:name, :order, reorder: [:id, :order])
      end

      def load_category
        @category = Category.find(params[:id])
        unless @category
          render status: :not_found, json: { error: t("not_found", entity: "Category") }
        end
      end
  end
