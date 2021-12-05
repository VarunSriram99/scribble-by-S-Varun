  # frozen_string_literal: true

  class Api::RedirectionsController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_action :load_redirection, only: %i[update destroy]

    def index
      redirections = Redirection.all
      render status: :ok, json: { "Redirections": redirections }
    end

    def create
      redirection = Redirection.new(redirection_params)
      if redirection.save!
        render status: :ok, json: { notice: t("successfully_created", entity: "Redirection") }
      else
        error = redirection.errors.full_messages.to_sentence
        render status: :unprocessable_entity, json: { error: error }
      end
    end

    def update
      if @redirection.update!(redirection_params)
        render status: :ok, json: { notice: t("successfully_updated", entity: "Redirection") }
      else
        error = @redirection.errors.full_messages.to_sentence
        render status: :unprocessable_entity, json: { error: error }
      end
    end

    def destroy
      if @redirection.destroy
        render status: :ok, json: { notice: t("successfully_deleted", entity: "Redirection") }
      else
        error = @redirection.errors.full_messages.to_sentence
        render status: :unprocessable_entity, json: { error: error }
      end
    end

    private

      def redirection_params
        params.require(:redirection).permit(:from, :to)
      end

      def load_redirection
        @redirection = Redirection.find_by(id: params[:id])
        unless @redirection
          render status: :not_found, json: { error: t("not_found", entity: "Redirection") }
        end
      end
  end
