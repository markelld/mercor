module Inputs
  class BookmarkInputType < Types::BaseInputObject
    argument :title, String, required: false
    argument :url, String, required: false
    argument :description, String, required: false
    argument :tags, [String], required: false
  end
end
