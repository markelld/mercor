require "rails_helper"

RSpec.describe "Bookmarks GraphQL", type: :request do
  let(:schema) { MercorBookmarkManagerSchema }

  describe "bookmarks query" do
    let!(:ruby_bookmark) do
      Bookmark.create!(
        title: "Ruby Docs",
        url: "https://ruby-doc.org",
        description: "Official Ruby docs",
        tags: ["ruby", "docs"]
      )
    end

    let!(:rails_bookmark) do
      Bookmark.create!(
        title: "Rails Guides",
        url: "https://guides.rubyonrails.org",
        tags: ["rails", "docs"]
      )
    end

    it "returns all bookmarks when no tag filter is provided" do
      query = <<~GQL
        query {
          bookmarks {
            id
            title
            url
            tags
          }
        }
      GQL

      result = schema.execute(query)
      expect(result["errors"]).to be_nil
      data = result["data"]["bookmarks"]
      expect(data.length).to eq(2)
    end

    it "filters bookmarks by tag" do
      query = <<~GQL
        query {
          bookmarks(tag: "ruby") {
            id
            title
            tags
          }
        }
      GQL

      result = schema.execute(query)
      expect(result["errors"]).to be_nil
      data = result["data"]["bookmarks"]
      expect(data.length).to eq(1)
      expect(data.first["title"]).to eq("Ruby Docs")
    end
  end

  describe "createBookmark mutation" do
    it "creates a bookmark with valid input" do
      mutation = <<~GQL
        mutation {
          createBookmark(
            title: "GraphQL Docs"
            url: "https://graphql.org"
            description: "Official GraphQL documentation"
            tags: ["graphql", "api"]
          ) {
            id
            title
            url
            tags
          }
        }
      GQL

      result = schema.execute(mutation)
      expect(result["errors"]).to be_nil
      data = result["data"]["createBookmark"]
      expect(data["title"]).to eq("GraphQL Docs")
      expect(data["tags"]).to contain_exactly("graphql", "api")
    end

    it "returns an error for an invalid URL" do
      mutation = <<~GQL
        mutation {
          createBookmark(
            title: "Bad Bookmark"
            url: "not-a-url"
            tags: []
          ) {
            id
          }
        }
      GQL

      result = schema.execute(mutation)
      expect(result["errors"]).not_to be_nil
      expect(result["errors"].first["message"]).to include("must be a valid URL")
    end
  end

  describe "deleteBookmark mutation" do
    let!(:bookmark) { Bookmark.create!(title: "To Delete", url: "https://example.com", tags: []) }

    it "deletes an existing bookmark" do
      mutation = <<~GQL
        mutation {
          deleteBookmark(id: "#{bookmark.id}") {
            success
          }
        }
      GQL

      result = schema.execute(mutation)
      expect(result["errors"]).to be_nil
      expect(result["data"]["deleteBookmark"]["success"]).to be true
      expect(Bookmark.find_by(id: bookmark.id)).to be_nil
    end
  end
end
