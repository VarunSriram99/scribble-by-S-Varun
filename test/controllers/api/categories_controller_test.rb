# frozen_string_literal: true

require "test_helper"

class Api::CategoriesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @category = create(:category)
    @category_headers = headers(@category)
  end

  def test_should_list_all_categories
    get api_categories_path, headers: @category_headers
    assert_response :success
    response_body = response.parsed_body
    all_categories = response_body["categories"]
    assert_equal all_categories.length, Category.count
  end

  def test_should_create_valid_categories
    post api_categories_path,
      headers: @category_headers,
      params: { "category": { name: "Category" } }
    assert_response :success
    response_json = response.parsed_body
    assert_equal response_json["notice"], t("successfully_created", entity: "Category")
  end

  def test_should_delete_categories
    assert_difference "Category.count", -1 do
      delete api_category_path(@category),
        headers: @category_headers
      assert_response :success
      response_json = response.parsed_body
      assert_equal response_json["notice"], t("successfully_destroyed", entity: "Category")
    end
  end

  def test_should_update_category
    put api_category_path(@category),
      headers: @category_headers,
      params: { "category": { name: "Category" } }
    assert_response :success
    response_json = response.parsed_body
    assert_equal response_json["notice"], t("successfully_updated", entity: "Category")
    @category.reload
    assert_equal @category.name, "Category"
  end

  def test_should_reorder_categories
    category2 = create(:category)
    post api_categories_reorder_path,
      headers: @category_headers,
      params: { category: { reorder: { ids: [1, 2], orders: [{ order: 2 }, { order: 1 }] } } }
    assert_response :success
    response_json = response.parsed_body
    assert_equal response_json["message"], t("successfully_reordered")
    @category.reload
    category2.reload
    assert_equal @category.order, 2
    assert_equal category2.order, 1
  end

  def test_category_should_not_be_created_without_valid_name
    post api_categories_path,
      headers: @category_headers,
      params: { category: { name: nil } }
    assert_response :unprocessable_entity
    assert_nil response.parsed_body["notice"]
  end

  def test_category_should_not_be_updated_without_valid_name
    put api_category_path(@category),
      headers: @category_headers,
      params: { "category": { name: nil } }
    assert_response :unprocessable_entity
    assert_nil response.parsed_body["notice"]
  end

  def test_category_should_not_be_created_without_valid_name
    post api_categories_path,
      headers: @category_headers,
      params: { "category": { name: nil } }
    assert_response :unprocessable_entity
    assert_nil response.parsed_body["notice"]
  end
end
