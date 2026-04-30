import { gql } from "@apollo/client";

export const GET_BOOKMARKS = gql`
  query GetBookmarks($tag: String) {
    bookmarks(tag: $tag) {
      id
      title
      url
      description
      tags
      createdAt
    }
  }
`;

export const GET_BOOKMARK = gql`
  query GetBookmark($id: ID!) {
    bookmark(id: $id) {
      id
      title
      url
      description
      tags
      createdAt
    }
  }
`;

export const CREATE_BOOKMARK = gql`
  mutation CreateBookmark(
    $title: String!
    $url: String!
    $description: String
    $tags: [String!]
  ) {
    createBookmark(title: $title, url: $url, description: $description, tags: $tags) {
      id
      title
      url
      description
      tags
      createdAt
    }
  }
`;

export const UPDATE_BOOKMARK = gql`
  mutation UpdateBookmark(
    $id: ID!
    $title: String
    $url: String
    $description: String
    $tags: [String!]
  ) {
    updateBookmark(id: $id, title: $title, url: $url, description: $description, tags: $tags) {
      id
      title
      url
      description
      tags
      createdAt
    }
  }
`;

export const DELETE_BOOKMARK = gql`
  mutation DeleteBookmark($id: ID!) {
    deleteBookmark(id: $id) {
      success
    }
  }
`;
