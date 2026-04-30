# Mercor Bookmark Manager — Backend (Rails + GraphQL + PostgreSQL)

## Requirements
- Ruby 3.3.x
- Rails 8.1.2
- PostgreSQL 16

## Setup

### 1. Install dependencies
```bash
bundle install
```

### 2. Set up and migrate the database
```bash
rails db:create
rails db:migrate
```

### 3. Run the Rails server
```bash
rails server
# API available at http://localhost:3000/graphql
```

### 4. Run backend tests
```bash
bundle exec rspec spec/graphql/bookmarks_spec.rb
```

---

## GraphQL Endpoint

`POST http://localhost:3000/graphql`

---

## Example Queries & Mutations

### Get all bookmarks
```graphql
query {
  bookmarks {
    id title url description tags createdAt
  }
}
```

### Filter by tag
```graphql
query {
  bookmarks(tag: "ruby") {
    id title tags
  }
}
```

### Get single bookmark
```graphql
query {
  bookmark(id: "1") {
    id title url description tags
  }
}
```

### Create
```graphql
mutation {
  createBookmark(
    title: "GraphQL Docs"
    url: "https://graphql.org"
    description: "Official docs"
    tags: ["graphql", "api"]
  ) {
    id title tags createdAt
  }
}
```

### Update
```graphql
mutation {
  updateBookmark(id: "1" title: "New Title" tags: ["updated"]) {
    id title tags
  }
}
```

### Delete
```graphql
mutation {
  deleteBookmark(id: "1") {
    success
  }
}
```

---

## Frontend

See `../mercor-bookmark-manager-client/` for the React + TypeScript frontend.

```bash
cd ../mercor-bookmark-manager-client
npm install
npm run dev
# Runs on http://localhost:5173
```
