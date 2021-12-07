# frozen_string_literal: true

require "test_helper"

class Api::PublicControllerTest < ActionDispatch::IntegrationTest
  def setup
    @article = create(:article)
    @article.create_slug
    @site_setting = create(:site_setting, password: "welcome123")
    @public_headers = headers(@site_setting)
  end

  def test_should_list_all_categories
    get api_public_index_path, headers: { "X-Auth-Token": @site_setting.authentication_token }
    assert_response :success
    all_categories = response.parsed_body
    category_data = {
      "name" => @article.category.name, "order" => @article.category.order,
      "articles" => [{ "title" => @article.title, "slug" => @article.slug }]
    }
    assert_equal all_categories["categories"], [category_data]
  end

  def test_should_show_requested_category
    get api_public_index_path + "/#{@article.slug}", headers: { "X-Auth-Token": @site_setting.authentication_token }
    assert_response :success
    response_body = response.parsed_body
    assert_equal @article.title, response_body["article"]["title"]
  end

  def test_should_not_show_requested_category_without_valid_slug
    get api_public_index_path + "/something-which-is-not-a-slug",
      headers: { "X-Auth-Token": @site_setting.authentication_token }
    assert_response :not_found
  end
end
