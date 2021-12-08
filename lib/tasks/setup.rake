desc 'drops the db, creates db, migrates db and populates sample data'
task setup: [:environment, 'db:drop', 'db:create', 'db:migrate'] do
  Rake::Task['populate_with_sample_data'].invoke
end

task populate_with_sample_data: [:environment] do
    create_sample_data!
    puts "sample data has been added."
end

def create_sample_data!
  puts 'Seeding with sample data...'
  SiteSetting.create(name: "Spinkart")
  User.create(name: "Oliver Smith")
  categories = [{name: "General"},
    {name: "Security & Privacy"},
    {name: "Getting Started"},
    {name: "Navigation"},
    {name: "Misc."}]
  Category.create(categories)
  lorem_text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt"
  articles_data = [{title: "Setting up", body: lorem_text, category_id: 5, user_id: 1 },
    {title: "Writing an article", body: lorem_text, category_id: 3, user_id: 1},
    {title: "Welcome to Scribble", body: lorem_text, category_id: 1, user_id: 1},
    {title: "Redirections", body: lorem_text, category_id: 2, user_id: 1},
    {title: "301 and 302 Redirections", body: lorem_text, category_id: 2, user_id: 1},
    {title: "Password Protection", body: lorem_text, category_id: 2, user_id: 1},
    {title: "Typography", body: lorem_text, category_id: 5, user_id: 1},
    {title: "Publishing an article", body: lorem_text, category_id: 3, user_id: 1}]
  Article.create(articles_data)
  articles = Article.all
  articles.each { |article| article.create_slug }
end
