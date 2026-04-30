import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client/react";
import { CREATE_BOOKMARK, UPDATE_BOOKMARK, GET_BOOKMARKS } from "../graphql/queries";
import type { Bookmark, BookmarkFormData } from "../types";

interface Props {
  bookmark?: Bookmark;
  onClose: () => void;
  activeTag: string;
}

const empty: BookmarkFormData = { title: "", url: "", description: "", tags: [] };

export default function BookmarkForm({ bookmark, onClose, activeTag }: Props) {
  const [form, setForm] = useState<BookmarkFormData>(empty);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (bookmark) {
      setForm({
        title: bookmark.title,
        url: bookmark.url,
        description: bookmark.description ?? "",
        tags: bookmark.tags,
      });
    } else {
      setForm(empty);
    }
  }, [bookmark]);

  const refetchQueries = [{ query: GET_BOOKMARKS, variables: { tag: activeTag || undefined } }];

  const [createBookmark, { loading: creating }] = useMutation(CREATE_BOOKMARK, {
    refetchQueries,
    onCompleted: onClose,
    onError: (e) => setError(e.message),
  });

  const [updateBookmark, { loading: updating }] = useMutation(UPDATE_BOOKMARK, {
    refetchQueries,
    onCompleted: onClose,
    onError: (e) => setError(e.message),
  });

  const loading = creating || updating;

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !form.tags.includes(t)) {
      setForm((f) => ({ ...f, tags: [...f.tags, t] }));
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const vars = {
      title: form.title,
      url: form.url,
      description: form.description || undefined,
      tags: form.tags,
    };
    if (bookmark) {
      updateBookmark({ variables: { id: bookmark.id, ...vars } });
    } else {
      createBookmark({ variables: vars });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          {bookmark ? "Edit Bookmark" : "New Bookmark"}
        </h2>

        {error && (
          <p className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Title *</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">URL *</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              value={form.url}
              onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
              placeholder="https://..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Tags</label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Add tag..."
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Add
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm rounded-lg bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : bookmark ? "Save" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
