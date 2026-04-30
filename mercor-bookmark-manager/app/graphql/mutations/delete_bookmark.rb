module Mutations
  class DeleteBookmark < BaseMutation
    argument :id, ID, required: true

    field :success, Boolean, null: false

    def resolve(id:)
      bookmark = Bookmark.find_by(id: id)
      raise GraphQL::ExecutionError, "Bookmark not found" unless bookmark

      bookmark.destroy
      { success: true }
    end
  end
end
