# frozen_string_literal: true

json.articles @articles do |article|
  json.extract! article,
    :id,
    :title

  json.status article.slug.nil? ? "Draft" : "Published"
  json.category article.category&.name
  json.author article.user.name
  json.date article.published_date.nil? ? "-" : article.published_date.to_date.to_formatted_s(:long_ordinal)

end
