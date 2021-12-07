# frozen_string_literal: true

class Api::PublicController < ApplicationController
  before_action :load_article, only: :show
  before_action :authenticate_user_using_x_auth_token

  def index
    @categories = Category.all
  end

  def show
    render
  end

  private

    def load_article
      @article = Article.find_by(slug: params[:slug])
      unless @article
        render status: :not_found, json: { error: t("not_found", entity: "Article") }
      end
    end
end
