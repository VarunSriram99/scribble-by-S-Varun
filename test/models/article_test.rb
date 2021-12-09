# frozen_string_literal: true

require "test_helper"

class ArticleTest < ActiveSupport::TestCase
  def setup
    @article = build(:article)
  end

  def test_valid_article_will_be_accepted
    assert @article.save! # TODO: Useless test case. Please avoid in future.
  end

  def test_article_title_should_not_be_blank
    @article.title = nil
    assert_not @article.valid?
    assert_equal ["Title can't be blank"], @article.errors.full_messages # TODO: Should have used assert_includes since it's a collection.
  end

  def test_article_body_should_not_be_blank
    @article.body = nil
    assert_not @article.valid?
    assert_equal ["Body can't be blank"], @article.errors.full_messages
  end

  def test_slug_should_be_unique
    article2 = build(:article)
    article2.title = @article.title
    @article.create_slug
    article2.create_slug
    assert_not_equal @article.slug, article2.slug
  end

  def test_slug_names_cannot_be_equal
    article2 = build(:article)
    @article.create_slug
    @article.save
    assert_not article2.update(slug: @article.slug)
    assert_equal ["Slug has already been taken"], article2.errors.full_messages
  end
end
