# frozen_string_literal: true

class RedirectionValidator < ActiveModel::Validator
  include ActionView::Helpers::TranslationHelper
  def validate(record)
    if record.to == record.from
      record.errors.add(:to, t("redirection.same_from_to"))
    end
    redirection_taken = Redirection.exists?(from: record.to, to: record.from)
    if redirection_taken
      record.errors.add(:from, t("redirection.from_and_tos_form_loop"))
    end
  end
end
