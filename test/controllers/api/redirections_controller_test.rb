# frozen_string_literal: true

require "test_helper"

class Api::RedirectionsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @redirection = create(:redirection)
    @redirection_headers = headers(@redirection)
  end

  def test_should_list_all_redirections
    get api_redirections_path, headers: @redirection_headers
    assert_response :success
    response_body = response.parsed_body
    all_redirections = response_body["redirections"]
    assert_equal all_redirections.length, Redirection.count
  end

  def test_should_create_valid_redirection
    post api_redirections_path,
      headers: @redirection_headers,
      params: { redirection: { from: "/", to: "/hello" } }
    assert_response :success
    response_json = response.parsed_body
    assert_equal response_json["notice"], t("successfully_created", entity: "Redirection")
  end

  def test_should_delete_redirection
    assert_difference "Redirection.count", -1 do
      delete api_redirection_path(@redirection),
        headers: @redirection_headers
      assert_response :success
      response_json = response.parsed_body
      assert_equal response_json["notice"], t("successfully_destroyed", entity: "Redirection")
    end
  end

  def test_should_update_redirection
    put api_redirection_path(@redirection),
      headers: @redirection_headers,
      params: { redirection: { from: "/", to: "/hello" } }
    assert_response :success
    response_json = response.parsed_body
    assert_equal response_json["notice"], t("successfully_updated", entity: "Redirection")
    @redirection.reload
    assert_equal @redirection.from, "/"
    assert_equal @redirection.to, "/hello"
  end

  def test_should_not_update_redirection_without_valid_from_and_to_paths
    put api_redirection_path(@redirection),
      headers: @redirection_headers,
      params: { redirection: { from: "/", to: "/" } }
    assert_response :unprocessable_entity
    assert_nil response.parsed_body["notice"]
  end
end
