# frozen_string_literal: true

class Api::ArticlesController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :load_article, only: %i[show update destroy]
  after_action :generate_slug, only: %i[create update]

  def index
    @articles = Article.all
  end

  def show
    render
  end

  def create
    user = User.first
    if (@article = user.articles.new(article_params.except(:publish))) && @article.save
      render status: :ok, json: { notice: t("successfully_created", entity: "Article") }
    else
      error = @article.errors.full_messages.to_sentence
      render status: :unprocessable_entity, json: { error: error }
    end
  end

  def update
    if @article.update(article_params.except(:publish))
      render status: :ok, json: { notice: t("successfully_updated", entity: "Article") }
    else
      error = @article.errors.full_messages.to_sentence
      render status: :unprocessable_entity, json: { error: error }
    end
  end

  def destroy
    if @article.destroy
      render status: :ok, json: { notice: t("successfully_destroyed", entity: "Article") }
    else
      error = @article.errors.full_messages.to_sentence
      render status: :unprocessable_entity, json: { error: error }
    end
  end

  private

    def article_params
      params.require(:article).permit(:title, :category_id, :body, :publish)
    end

    def load_article
      @article = Article.find_by(id: params[:id])
      unless @article
        render status: :not_found, json: { error: t("not_found", entity: "Article") }
      end
    end

    def generate_slug
      if article_params[:publish]
        @article.create_slug
      else
        @article.update(slug: nil, published_date: nil)
      end
    end
end
