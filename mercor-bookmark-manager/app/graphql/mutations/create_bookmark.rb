module Mutations
  class CreateBookmark < BaseMutation
    argument :title, String, required: true
    argument :url, String, required: true
    argument :description, String, required: false
    argument :tags, [String], required: false, default_value: []

    type Types::BookmarkType

    def resolve(title:, url:, description: nil, tags: [])
      bookmark = Bookmark.new(title: title, url: url, description: description, tags: tags)
      unless bookmark.save
        raise GraphQL::ExecutionError, bookmark.errors.full_messages.join(", ")
      end
      bookmark
    end
  end
end
