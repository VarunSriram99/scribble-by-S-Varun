# frozen_string_literal: true

require "test_helper"

class SiteSettingTest < ActiveSupport::TestCase
  def setup
    @site_setting = build(:site_setting)
  end

  def test_valid_site_settings_should_be_accepted
    assert @site_setting.save!
  end

  def test_name_should_not_be_blank
    @site_setting.name = nil
    assert_not @site_setting.valid?
    assert_includes @site_setting.errors.full_messages, "Name can't be blank"
  end

  def test_auth_token_should_be_present
    @site_setting.save!
    assert_not_nil @site_setting.authentication_token
  end
end
