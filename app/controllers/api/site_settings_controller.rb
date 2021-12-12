  # frozen_string_literal: true

  class Api::SiteSettingsController < ApplicationController
    skip_before_action :verify_authenticity_token

    def index
      site_setting = SiteSetting.first
      render status: :ok, json: { site_name: site_setting.name, has_password: !site_setting.password_digest.nil? }
    end

    def update
      site_setting = SiteSetting.first
      if site_setting.update(site_settings_params)
        render status: :ok, json: { notice: t("successfully_updated", entity: "Site Settings") }
      else
        error = site_setting.errors.full_messages.to_sentence
        render status: :unprocessable_entity, json: { error: error }
      end
    end

    private

      def site_settings_params
        params.require(:site_settings).permit(:name, :password)
      end
  end
