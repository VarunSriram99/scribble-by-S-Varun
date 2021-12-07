# frozen_string_literal: true

FactoryBot.define do
  factory :redirection do
    from { Faker::Internet.url(host: "faker").split("http://faker")[1] }
    to { Faker::Internet.url(host: "faker").split("http://faker")[1] }
  end
end
