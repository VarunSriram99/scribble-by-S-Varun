# frozen_string_literal: true

json.article do
  json.extract! @article,
    :title,
    :body,
    :category_id
  json.category @article.category&.name
end
