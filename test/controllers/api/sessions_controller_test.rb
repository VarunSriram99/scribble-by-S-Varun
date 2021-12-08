# frozen_string_literal: true

require "test_helper"

class Api::SessionsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = create(:site_setting, password: "hello123")
  end

  def test_should_login_with_valid_credentials
    post api_sessions_path, params: { login: { password: @user.password } }, as: :json
    assert_response :success
    assert_equal response.parsed_body["authentication_token"], @user.authentication_token
  end

  def test_shouldnt_login_with_invalid_credentials
    post api_sessions_path, params: { login: { password: "welcome" } }, as: :json
    assert_response :unauthorized
    assert_nil response.parsed_body["notice"]
  end

  def test_shouldnt_require_login_if_password_nil
    @user.update(password_digest: nil)
    post api_sessions_path, as: :json
    assert_response :success
    assert_equal response.parsed_body["authentication_token"], @user.authentication_token
  end
end
