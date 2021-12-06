json.categories @categories do |category|
  json.extract! category, :name, :order
  json.articles category.articles do |article|
    unless(article.slug.nil?)
      json.extract! article, :title
      json.slug article.slug
    end
  end
end
