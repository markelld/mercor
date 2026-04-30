import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { MockLink } from "@apollo/client/testing";
import BookmarkForm from "../components/BookmarkForm";
import { CREATE_BOOKMARK, GET_BOOKMARKS } from "../graphql/queries";

const mocks = [
  {
    request: {
      query: CREATE_BOOKMARK,
      variables: {
        title: "Test Site",
        url: "https://example.com",
        description: undefined,
        tags: [],
      },
    },
    result: {
      data: {
        createBookmark: {
          id: "1",
          title: "Test Site",
          url: "https://example.com",
          description: null,
          tags: [],
          createdAt: new Date().toISOString(),
        },
      },
    },
  },
  {
    request: { query: GET_BOOKMARKS, variables: { tag: undefined } },
    result: { data: { bookmarks: [] } },
  },
];

function renderWithApollo(ui: React.ReactElement) {
  const client = new ApolloClient({
    link: new MockLink(mocks, true, { showWarnings: false }),
    cache: new InMemoryCache(),
  });
  return render(<ApolloProvider client={client}>{ui}</ApolloProvider>);
}

describe("BookmarkForm", () => {
  it("renders form fields", () => {
    renderWithApollo(<BookmarkForm onClose={vi.fn()} activeTag="" />);

    expect(screen.getByPlaceholderText("https://...")).toBeInTheDocument();
    expect(screen.getByText("Title *")).toBeInTheDocument();
    expect(screen.getByText("Create")).toBeInTheDocument();
  });

  it("calls onClose when Cancel is clicked", () => {
    const onClose = vi.fn();
    renderWithApollo(<BookmarkForm onClose={onClose} activeTag="" />);

    fireEvent.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("shows edit mode title when bookmark prop is provided", () => {
    const bookmark = {
      id: "1",
      title: "My Site",
      url: "https://example.com",
      description: "A desc",
      tags: ["test"],
      createdAt: new Date().toISOString(),
    };

    renderWithApollo(
      <BookmarkForm bookmark={bookmark} onClose={vi.fn()} activeTag="" />
    );

    expect(screen.getByText("Edit Bookmark")).toBeInTheDocument();
    expect(screen.getByDisplayValue("My Site")).toBeInTheDocument();
  });
});
