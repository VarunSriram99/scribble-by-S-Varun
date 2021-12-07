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
end
