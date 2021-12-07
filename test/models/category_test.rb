# frozen_string_literal: true

require "test_helper"

class CategoryTest < ActiveSupport::TestCase
  def setup
    @category = build(:category)
  end

  def test_valid_category_should_be_accepted
    assert @category.save!
  end

  def test_category_should_not_be_blank
    @category.name = nil
    assert_not @category.valid?
    assert_equal ["Name can't be blank"], @category.errors.full_messages
  end

  def test_category_should_be_unique
    @category.save!
    category2 = @category.dup
    assert_not category2.valid?
    assert_equal ["Name has already been taken"], category2.errors.full_messages
  end
end
