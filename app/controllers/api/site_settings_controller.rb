  # frozen_string_literal: true

  class Api::SiteSettingsController < ApplicationController
    skip_before_action :verify_authenticity_token

    def index
      site_setting = SiteSetting.first_or_create!(name: "Spinkart").name
      render status: :ok, json: { "site_name": site_setting }
    end

    def update
      # Using first or create here instead of first so that a new record is created if table is empty
      site_setting = SiteSetting.first_or_create!(name: "Spinkart")
      if site_setting.update!(site_settings_params)
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