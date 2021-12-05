# frozen_string_literal: true

class Article < ApplicationRecord
  validates :title, presence: true, length: { maximum: 255 }
  validates :body, presence: true
  validates :slug, uniqueness: true, allow_blank: true, allow_nil: true

  belongs_to :user
  belongs_to :category

  def create_slug
    return unless slug.nil?

    name_slug = title.parameterize
    regex_pattern = "slug #{Constants::DB_REGEX_OPERATOR} ?"
    latest_quiz_slug = Article.where(
      regex_pattern,
      "#{name_slug}$|#{name_slug}-[0-9]+$"
    ).order("LENGTH(slug) DESC", slug: :desc).first&.slug
    slug_count = 0
    if latest_quiz_slug.present?
      slug_count = latest_quiz_slug.split("-").last.to_i

      only_one_slug_exists = slug_count == 0
      slug_count = 1 if only_one_slug_exists
    end
    slug_candidate = slug_count.positive? ? "#{name_slug}-#{slug_count + 1}" : name_slug
    self.update!(slug: slug_candidate, published_date: DateTime.now)
  end
end
