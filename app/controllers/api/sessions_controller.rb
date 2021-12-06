# frozen_string_literal: true

class Api::SessionsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    site_setting = SiteSetting.first
    if site_setting.password_digest.nil?
      render status: :ok, json: { authentication_token: site_setting.authentication_token }
    else
      unless site_setting.authenticate(login_params[:password])
        render status: :unauthorized, json: { error: t("session.incorrect_credentials") }
      else
        render status: :ok, json: { authentication_token: site_setting.authentication_token }
      end
    end
  end

  private

    def login_params
      params.require(:login).permit(:password)
    end
end
