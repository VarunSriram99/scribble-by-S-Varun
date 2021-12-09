# frozen_string_literal: true

json.article do
  json.extract! @article,
    :title, # TODO: Please format correctly. Multiline args should have 2 spaces before.
    :body # TODO: Same as above comment.
  json.date @article.published_date.strftime("%e %B, %Y")
  json.category @article.category&.name
end
