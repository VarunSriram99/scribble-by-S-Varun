# frozen_string_literal: true

FactoryBot.define do
  factory :article do
    title { Faker::Name.name }
    body { Faker::Lorem.paragraph(sentence_count: rand(2..20)) }
    association :category, factory: :category
    user_id { User.create(name: "Oliver Smith").id }
  end
end
