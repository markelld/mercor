class Bookmark < ApplicationRecord
  validates :title, presence: true
  validates :url, presence: true, format: {
    with: /\Ahttps?:\/\/.+/i,
    message: "must be a valid URL starting with http:// or https://"
  }
  validates :tags, length: { maximum: 20, message: "cannot have more than 20 tags" }

  scope :with_tag, ->(tag) { where("? = ANY(tags)", tag) }
end
