# frozen_string_literal: true

class SiteSetting < ApplicationRecord
  VALID_PASSWORD_REGEX = /\A((.*[A-Za-z])(.*[0-9])|(.*[0-9])(.*[A-Za-z]))\z/.freeze
  validates :name, presence: true
  has_secure_password validations: false
  has_secure_token :authentication_token

  validates :password, length: { minimum: 6 }, allow_blank: true, format: { with: VALID_PASSWORD_REGEX }, if: -> {
  password.present? }
end
