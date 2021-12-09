# frozen_string_literal: true

class Redirection < ApplicationRecord
  include ActiveModel::Validations

  validates :from, presence: true, uniqueness: { case_sensitive: false },
format: { without: /\s/, message: "URL cannot have whitespaces" }
  validates :to, presence: true, format: { without: /\s/, message: "URL cannot have whitespaces" }
  validates_with RedirectionValidator
end
