json.article do
  json.extract! @article,
  :title,
  :body
  json.date @article.published_date.strftime("%e %B, %Y")
  json.category @article.category&.name
end
