# frozen_string_literal: true

require "test_helper"

class RedirectionTest < ActiveSupport::TestCase
  def setup
    @redirection = build(:redirection)
  end

  def test_valid_redirections_will_be_accepted
    assert @redirection.save!
  end

  def test_to_path_should_not_be_equal_to_from_path
    from_path = @redirection.from
    @redirection.to = from_path
    assert_not @redirection.valid?
    assert_equal @redirection.errors.full_messages, ["To To URL can't be same as from URL"]
  end

  def test_from_paths_should_be_unique
    @redirection.save!
    redirection_2 = build(:redirection)
    from_path = @redirection.from
    assert_not redirection_2.update(from: from_path)
    assert_equal redirection_2.errors.full_messages, ["From has already been taken"]
  end

  def test_from_and_to_paths_should_not_form_loops
    @redirection.save!
    redirection_2 = @redirection.dup
    # Forms a loop where redirection1 redirects from a->b and redirection2 from b->a
    assert_not redirection_2.update(from: @redirection.to, to: @redirection.from)
    assert_equal redirection_2.errors.full_messages,
      ["From A previous From and To URL forms a loop. This will cause an infinite loop!"]
  end

  def test_from_path_shouldnot_contain_whitespaces
    @redirection.from = "/hello world"
    assert_not @redirection.valid?
    assert_equal @redirection.errors.full_messages, ["From URL cannot have whitespaces"]
  end

  def test_to_path_shouldnot_contain_whitespaces
    @redirection.to = "/hello world"
    assert_not @redirection.valid?
    assert_equal @redirection.errors.full_messages, ["To URL cannot have whitespaces"]
  end
end
