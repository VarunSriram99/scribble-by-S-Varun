# frozen_string_literal: true

class RedirectionValidator < ActiveModel::Validator
  include ActionView::Helpers::TranslationHelper

  def validate(record)
    if record.to == record.from
      record.errors.add(:to, t("redirection.same_from_to"))
    end
    redirections_form_cycle = Redirection.exists?(from: record.to, to: record.from)
    if redirections_form_cycle
      record.errors.add(:from, t("redirection.from_and_tos_form_loop"))
    end
  end
end
