# frozen_string_literal: true

class Redirection < ApplicationRecord
  validates :from, presence: true, uniqueness: { case_sensitive: false }
  validates :to, presence: true
  validate :check_from_and_to_not_equal
  validate :from_and_to_links_shouldnot_form_loops, :from_url_shouldnot_have_spaces, :to_url_shouldnot_have_spaces

  private

    def check_from_and_to_not_equal
      if from == to
        errors.add(:to, t("redirection.same_from_to"))
      end
    end

    def from_and_to_links_shouldnot_form_loops
      from_url_taken_in_previous_to_urls = Redirection.exists?(from: to, to: from)
      if from_url_taken_in_previous_to_urls
        errors.add(:from, t("redirection.from_and_tos_form_loop"))
      end
    end

    def from_url_shouldnot_have_spaces
      unless from.index(" ").nil?
        errors.add(:from, t("redirection.url_cannot_have_spaces"))
      end
    end

    def to_url_shouldnot_have_spaces
      unless to.index(" ").nil?
        errors.add(:to, t("redirection.url_cannot_have_spaces"))
      end
    end
end
