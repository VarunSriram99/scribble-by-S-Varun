# frozen_string_literal: true

class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  def authenticate_user_using_x_auth_token
    auth_token = request.headers["X-Auth-Token"].presence
    site_setting = SiteSetting.first
    check_auth_token_valid = ActiveSupport::SecurityUtils.secure_compare(
      site_setting.authentication_token, auth_token
    ) unless auth_token.nil?
    puts(auth_token)

    unless auth_token && check_auth_token_valid
      render status: :unauthorized, json: { error: t("session.could_not_authenticate") }
    end
  end
end
