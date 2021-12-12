# frozen_string_literal: true

require "test_helper"

class Api::ArticlesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @article = create(:article)
    @article_headers = headers(@article)
  end

  def test_should_list_all_articles
    get api_articles_path, headers: @article_headers
    assert_response :success
    response_body = response.parsed_body
    all_articles = response_body["articles"]
    assert_equal all_articles.length, Article.count
  end

  def test_should_delete_an_article
    assert_difference "Article.count", -1 do
      delete api_article_path(@article),
        headers: @article_headers
      assert_response :success
      response_json = response.parsed_body
      assert_equal response_json["notice"], t("successfully_destroyed", entity: "Article")
    end
  end

  def test_should_create_valid_article
    post api_articles_path,
      headers: @article_headers,
      params: { "article": { title: "hello", body: "hai", category_id: @article.category_id } }
    assert_response :success
    response_json = response.parsed_body
    assert_equal response_json["notice"], t("successfully_created", entity: "Article")
  end

  def test_show_the_requested_article
    get api_article_path(@article),
      headers: @article_headers
    assert_response :success
    response_body = response.parsed_body
    received_article = response_body["article"]
    assert_equal received_article["title"], @article.title
  end

  def test_should_update_article
    put api_article_path(@article),
      headers: @article_headers,
      params: { "article": { title: "hello", body: "hai", category_id: @article.category_id } }
    assert_response :success
    response_json = response.parsed_body
    assert_equal response_json["notice"], t("successfully_updated", entity: "Article")
    updated_article = Article.find(@article.id)
    assert_equal updated_article.title, "hello"
  end

  def test_should_not_update_article_without_valid_title
    put api_article_path(@article),
      headers: @article_headers,
      params: { "article": { title: nil } }
    assert_response :unprocessable_entity
    assert_nil = response.parsed_body["notice"]
  end

  def test_should_not_create_article_without_valid_title
    post api_articles_path,
      headers: @article_headers,
      params: { "article": { title: nil } }
    assert_response :unprocessable_entity
    assert_nil = response.parsed_body["notice"]
  end

  def test_should_not_load_article_for_invalid_article_id
    put api_article_path(10),
      headers: @article_headers,
      params: { "article": { title: "hello", body: "hai", category_id: @article.category_id } }
    assert_response :not_found
  end

  def test_slug_should_be_generated_if_publish_is_true
    put api_article_path(@article),
      headers: @article_headers,
      params: { "article": { title: "hello", body: "hai", category_id: @article.category_id, publish: true } }
    assert_response :success
    @article.reload
    assert_equal @article.slug, "hello"
    assert_not_nil @article.published_date
  end

  def test_slug_should_be_nil_if_publish_is_false
    put api_article_path(@article),
      headers: @article_headers,
      params: { "article": { title: "hello", body: "hai", category_id: @article.category_id, publish: nil } }
    assert_response :success
    @article.reload
    assert_nil @article.slug
  end
end
