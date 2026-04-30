module Types
  class MutationType < Types::BaseObject
    field :create_bookmark, mutation: Mutations::CreateBookmark
    field :update_bookmark, mutation: Mutations::UpdateBookmark
    field :delete_bookmark, mutation: Mutations::DeleteBookmark
  end
end
