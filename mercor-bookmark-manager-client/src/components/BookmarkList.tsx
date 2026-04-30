import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_BOOKMARKS, DELETE_BOOKMARK } from "../graphql/queries";
import type { Bookmark } from "../types";
import BookmarkForm from "./BookmarkForm";

export default function BookmarkList() {
  const [tagFilter, setTagFilter] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Bookmark | undefined>(undefined);

  const { data, loading, error } = useQuery(GET_BOOKMARKS, {
    variables: { tag: activeTag || undefined },
  });

  const [deleteBookmark] = useMutation(DELETE_BOOKMARK, {
    refetchQueries: [{ query: GET_BOOKMARKS, variables: { tag: activeTag || undefined } }],
  });

  const bookmarks: Bookmark[] = data?.bookmarks ?? [];

  const allTags = Array.from(new Set(bookmarks.flatMap((b) => b.tags))).sort();

  const handleTagClick = (tag: string) => {
    const next = activeTag === tag ? "" : tag;
    setActiveTag(next);
    setTagFilter(next);
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTagFilter(val);
    setActiveTag(val.trim());
  };

  const handleDelete = (bookmark: Bookmark) => {
    if (window.confirm(`Delete "${bookmark.title}"?`)) {
      deleteBookmark({ variables: { id: bookmark.id } });
    }
  };

  const openCreate = () => {
    setEditing(undefined);
    setShowForm(true);
  };

  const openEdit = (bookmark: Bookmark) => {
    setEditing(bookmark);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Bookmarks</h1>
          <button
            onClick={openCreate}
            className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700"
          >
            + New
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Tag filter input */}
        <input
          className="w-full border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-gray-900"
          placeholder="Filter by tag..."
          value={tagFilter}
          onChange={handleTagInputChange}
        />

        {/* Tag chips */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  activeTag === tag
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* States */}
        {loading && <p className="text-sm text-gray-400">Loading...</p>}
        {error && <p className="text-sm text-red-500">Error: {error.message}</p>}

        {!loading && bookmarks.length === 0 && (
          <p className="text-sm text-gray-400">
            {activeTag ? `No bookmarks tagged "${activeTag}".` : "No bookmarks yet."}
          </p>
        )}

        {/* Bookmark cards */}
        <div className="space-y-3">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="bg-white border border-gray-200 rounded-xl p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-medium text-gray-900 hover:underline truncate block"
                  >
                    {bookmark.title}
                  </a>
                  <span className="text-xs text-gray-400 truncate block">{bookmark.url}</span>
                  {bookmark.description && (
                    <p className="text-sm text-gray-500 mt-1">{bookmark.description}</p>
                  )}
                  {bookmark.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {bookmark.tags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => handleTagClick(tag)}
                          className={`text-xs px-2 py-0.5 rounded-full border ${
                            activeTag === tag
                              ? "bg-gray-900 text-white border-gray-900"
                              : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-400"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => openEdit(bookmark)}
                    className="text-xs text-gray-400 hover:text-gray-700 px-2 py-1 rounded border border-transparent hover:border-gray-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(bookmark)}
                    className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded border border-transparent hover:border-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <BookmarkForm
          bookmark={editing}
          onClose={closeForm}
          activeTag={activeTag}
        />
      )}
    </div>
  );
}
