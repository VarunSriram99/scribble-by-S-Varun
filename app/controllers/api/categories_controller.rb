  # frozen_string_literal: true

  class Api::CategoriesController < ApplicationController
    before_action :load_category, only: %i[update destroy]
    skip_before_action :verify_authenticity_token

    def index
      categories = Category.all
      render status: :ok, json: { "Categories": categories }
    end

    def create
      if (category = Category.new(category_params)) && category.save
        render status: :ok, json: { notice: t("successfully_created", entity: "Category") }
      else
        error = category.errors.full_messages.to_sentence
        render status: :unprocessable_entity, json: { error: error }
      end
    end

    def update
      if @category.update(category_params)
        render status: :ok, json: { notice: t("successfully_updated", entity: "Category") }
      else
        error = @category.errors.full_messages.to_sentence
        render status: :unprocessable_entity, json: { error: error }
      end
    end

    def reorder
      reorder = category_params["reorder"]
      if Category.update(reorder[:ids], reorder[:orders])
        render status: :ok, json: { notice: t("successfully_reordered") }
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
        params.require(:category).permit(:name, :order, { reorder: { ids: [], orders: [:order] } })
      end

      def load_category
        @category = Category.find(params[:id])
        unless @category
          render status: :not_found, json: { error: t("not_found", entity: "Category") }
        end
      end
  end
