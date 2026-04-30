module Mutations
  class UpdateBookmark < BaseMutation
    argument :id, ID, required: true
    argument :title, String, required: false
    argument :url, String, required: false
    argument :description, String, required: false
    argument :tags, [String], required: false

    type Types::BookmarkType

    def resolve(id:, **attrs)
      bookmark = Bookmark.find_by(id: id)
      raise GraphQL::ExecutionError, "Bookmark not found" unless bookmark

      attrs.compact!
      unless bookmark.update(attrs)
        raise GraphQL::ExecutionError, bookmark.errors.full_messages.join(", ")
      end
      bookmark
    end
  end
end
