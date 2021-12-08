# frozen_string_literal: true

require "test_helper"

class Api::SiteSettingsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @site_settings = create(:site_setting)
    @site_setting_headers = headers(@site_settings)
  end

  def test_should_list_all_site_settings
    get api_site_settings_path, headers: @site_setting_headers
    assert_response :success
    all_site_settings = response.parsed_body
    @site_settings.reload
    assert_equal all_site_settings["site_name"], @site_settings.name
    assert_equal all_site_settings["has_password"], !@site_settings.password_digest.nil?
  end

  def test_should_update_the_site_settings
    put api_site_setting_path(1),
      headers: @redirection_headers,
      params: { site_settings: { name: "hello" } }
    assert_response :success
    response_json = response.parsed_body
    assert_equal response_json["notice"], t("successfully_updated", entity: "Site Settings")
    @site_settings.reload
    assert_equal @site_settings.name, "hello"
  end
end
