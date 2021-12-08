# frozen_string_literal: true

class Api::SessionsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    site_setting = SiteSetting.first
    password_does_not_exist = site_setting.password_digest.nil?
    if password_does_not_exist || site_setting.authenticate(login_params[:password])
      render status: :ok, json: { authentication_token: site_setting.authentication_token }
    else
      render status: :unauthorized, json: { error: t("session.incorrect_credentials") }
    end
  end

  private

    def login_params
      params.require(:login).permit(:password)
    end
end
