module Types
  class QueryType < Types::BaseObject
    field :bookmarks, [Types::BookmarkType], null: false do
      argument :tag, String, required: false
    end

    field :bookmark, Types::BookmarkType, null: true do
      argument :id, ID, required: true
    end

    def bookmarks(tag: nil)
      if tag.present?
        Bookmark.with_tag(tag).order(created_at: :desc)
      else
        Bookmark.all.order(created_at: :desc)
      end
    end

    def bookmark(id:)
      Bookmark.find_by(id: id)
    end
  end
end
