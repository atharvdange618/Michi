import type { CSSProperties } from "react";
import { useRef, useEffect, useState } from "react";
import { useSearch, useLoaderData, useRouter, type LoaderContext } from "michi";
import { useSEO } from "../components/use-seo";
import { fetchUsersPage, type UsersPage } from "../mocks/api";

type UsersSearch = { page: number; sort: "name" | "date"; filter?: string };

export function validateSearch(raw: Record<string, string>): UsersSearch {
  const page = raw.page ? parseInt(raw.page, 10) : 1;
  const sort = raw.sort === "date" ? "date" : "name";
  const filter = raw.filter || undefined;

  if (!Number.isFinite(page) || page < 1) {
    throw new Error(`Invalid page param: "${raw.page}"`);
  }
  return { page, sort, filter };
}

export async function loader({ search }: LoaderContext<Record<string, string>, UsersSearch>) {
  return fetchUsersPage(search.page, search.sort, search.filter);
}

const codeBlockStyle: CSSProperties = {
  fontFamily: "'Geist Mono', monospace",
  fontSize: "13px",
  lineHeight: 1.8,
  margin: 0,
  whiteSpace: "pre-wrap",
  color: "var(--ink-muted)",
};

const metaBlockStyle: CSSProperties = {
  fontFamily: "'Geist Mono', monospace",
  fontSize: "13px",
  padding: "1rem 1.25rem",
  background: "var(--bg-raised)",
  borderRadius: "var(--radius)",
  lineHeight: 1.8,
  border: "1px solid var(--border-subtle)",
};

const sectionLabel: CSSProperties = {
  fontSize: "12px",
  fontFamily: "'Geist Mono', monospace",
  color: "var(--ink-faint)",
  marginBottom: "8px",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const errorContainerStyle: CSSProperties = {
  padding: "1.25rem 1.5rem",
  border: "1px solid var(--red-border)",
  borderRadius: "var(--radius-lg)",
  background: "var(--red-soft)",
  marginBottom: "1.5rem",
};

const btnBase: CSSProperties = {
  padding: "0.5rem 1rem",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-sm)",
  cursor: "pointer",
  fontSize: "14px",
  fontFamily: "inherit",
  transition: "border-color 150ms ease, opacity 150ms ease",
  background: "var(--surface)",
  color: "var(--ink)",
};

const sortBtnActive: CSSProperties = {
  ...btnBase,
  background: "var(--accent-soft)",
  borderColor: "var(--accent)",
  color: "var(--accent)",
};

const sortBtnInactive: CSSProperties = {
  ...btnBase,
  opacity: 0.6,
};

const filterInputStyle: CSSProperties = {
  padding: "0.5rem 0.75rem",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-sm)",
  fontSize: "14px",
  fontFamily: "inherit",
  background: "var(--surface)",
  color: "var(--ink)",
  width: "180px",
  outline: "none",
  transition: "border-color 150ms ease",
};

export default function UsersPage() {
  const search = useSearch<UsersSearch>();
  const data = useLoaderData<UsersPage>();
  const router = useRouter();
  const filterTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isInvalid = !search || !data;
  const urlFilter = isInvalid ? "" : (search.filter ?? "");
  const [filterValue, setFilterValue] = useState(urlFilter);

  // Sync local state when URL changes externally (Clear button, direct navigation)
  useEffect(() => {
    setFilterValue(urlFilter);
  }, [urlFilter]);

  useEffect(() => {
    return () => {
      if (filterTimer.current) clearTimeout(filterTimer.current);
    };
  }, []);

  useSEO({
    title: "Search Params",
    description:
      "Search params as typed, validated state in the URL. Pagination, filtering, and sharing URLs - all driven by ?key=value.",
    path: "/users",
  });

  const page = isInvalid ? NaN : search.page;
  const sort = isInvalid ? "name" : search.sort;

  // Build URL display string
  const searchParts = [`page=${isInvalid ? "abc" : page}`];
  if (sort !== "name") searchParts.push(`sort=${sort}`);
  if (urlFilter) searchParts.push(`filter=${urlFilter}`);
  const searchString = searchParts.join("&");

  return (
    <div style={{ maxWidth: "720px" }}>
      <h1
        style={{
          fontSize: "clamp(28px, 4vw, 36px)",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          margin: "0 0 0.5rem",
        }}
      >
        Search Params
      </h1>
      <p
        style={{
          fontSize: "15px",
          color: "var(--ink-muted)",
          margin: "0 0 2rem",
          maxWidth: "55ch",
          lineHeight: 1.6,
        }}
      >
        The URL is the source of truth. <code>?page=2&sort=date</code> is typed, validated state
        that survives refresh, works with back/forward, and can be shared via a link.
      </p>

      {/* Live URL display */}
      <div
        style={{
          fontFamily: "'Geist Mono', monospace",
          fontSize: "13px",
          padding: "0.75rem 1rem",
          background: "var(--bg-raised)",
          borderRadius: "var(--radius)",
          marginBottom: "1.5rem",
          border: "1px solid var(--border-subtle)",
          color: "var(--ink-muted)",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span style={{ color: "var(--ink-faint)" }}>url:</span>
        <span style={{ color: "var(--ink)" }}>/users</span>
        <span style={{ color: "var(--accent)" }}>?{searchString}</span>
      </div>

      {/* Error state for invalid params */}
      {isInvalid && (
        <div style={errorContainerStyle}>
          <div
            style={{ fontWeight: 600, fontSize: "14px", color: "var(--red)", marginBottom: "4px" }}
          >
            Validation failed
          </div>
          <div style={{ fontSize: "14px", color: "var(--ink-muted)", lineHeight: 1.6 }}>
            <code>validateSearch</code> threw because <code>?page=abc</code> is not a valid page
            number. The loader was skipped and no data was fetched.
          </div>
          <button
            onClick={() =>
              router.navigate("/users", { search: { page: 1, sort: "name" }, searchMode: "replace" })
            }
            style={{
              ...btnBase,
              marginTop: "0.75rem",
              borderColor: "var(--red-border)",
              color: "var(--red)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--red)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--red-border)";
            }}
          >
            Reset to page 1
          </button>
        </div>
      )}

      {/* User list + pagination + sort + filter */}
      {!isInvalid && (
        <>
          {/* Sort toggle + filter */}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <span
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: "12px",
                color: "var(--ink-faint)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              sort:
            </span>
            <button
              onClick={() =>
                router.navigate("/users", {
                  search: { page: 1, sort: "name", filter: urlFilter || undefined },
                  searchMode: "replace",
                })
              }
              style={sort === "name" ? sortBtnActive : sortBtnInactive}
            >
              Name
            </button>
            <button
              onClick={() =>
                router.navigate("/users", {
                  search: { page: 1, sort: "date", filter: urlFilter || undefined },
                  searchMode: "replace",
                })
              }
              style={sort === "date" ? sortBtnActive : sortBtnInactive}
            >
              Newest
            </button>

            <div style={{ width: "1px", height: "20px", background: "var(--border-subtle)" }} />

            <span
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: "12px",
                color: "var(--ink-faint)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              filter:
            </span>
            <input
              type="text"
              placeholder="search users..."
              value={filterValue}
              onChange={(e) => {
                const val = e.target.value;
                setFilterValue(val);
                if (filterTimer.current) clearTimeout(filterTimer.current);
                filterTimer.current = setTimeout(() => {
                  router.navigate("/users", {
                    search: (prev) => ({
                      ...prev,
                      page: 1,
                      filter: val || undefined,
                    }),
                  });
                }, 300);
              }}
              style={filterInputStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            />
            {filterValue && (
              <button
                onClick={() => {
                  setFilterValue("");
                  router.navigate("/users", {
                    search: (prev) => ({ ...prev, page: 1, filter: undefined }),
                  });
                }}
                style={{ ...btnBase, fontSize: "13px", padding: "0.5rem 0.75rem" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                }}
              >
                Clear
              </button>
            )}
          </div>

          <div
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: "13px",
              padding: "0.75rem 1rem",
              background: "var(--bg-inset)",
              borderRadius: "var(--radius)",
              marginBottom: "1rem",
              border: "1px solid var(--border-subtle)",
              color: "var(--ink-muted)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>
              page <span style={{ color: "var(--ink)" }}>{data.page}</span> of{" "}
              <span style={{ color: "var(--ink)" }}>{data.totalPages}</span>
            </span>
            <span style={{ color: "var(--ink-faint)" }}>{data.users.length} users</span>
          </div>

          <ul style={{ listStyle: "none", padding: 0, marginBottom: "1.5rem" }}>
            {data.users.map((u) => (
              <li
                key={u.id}
                style={{
                  padding: "0.5rem 0",
                  borderBottom: "1px solid var(--border-subtle)",
                  fontSize: "14px",
                  color: "var(--ink-muted)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: "12px",
                    color: "var(--ink-faint)",
                    minWidth: "2rem",
                  }}
                >
                  {u.id}
                </span>
                {u.name}
              </li>
            ))}
          </ul>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              disabled={page <= 1}
              onClick={() =>
                router.navigate("/users", {
                  search: (prev) => ({ ...prev, page: page - 1 }),
                })
              }
              style={{
                ...btnBase,
                opacity: page <= 1 ? 0.4 : 1,
                cursor: page <= 1 ? "default" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (page > 1) e.currentTarget.style.borderColor = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              &larr; Prev
            </button>
            <button
              disabled={page >= data.totalPages}
              onClick={() =>
                router.navigate("/users", {
                  search: (prev) => ({ ...prev, page: page + 1 }),
                })
              }
              style={{
                ...btnBase,
                opacity: page >= data.totalPages ? 0.4 : 1,
                cursor: page >= data.totalPages ? "default" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (page < data.totalPages) e.currentTarget.style.borderColor = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              Next &rarr;
            </button>
          </div>
        </>
      )}

      {/* How it works */}
      <div
        style={{
          marginTop: "2.5rem",
          padding: "1.25rem 1.5rem",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          background: "var(--surface)",
        }}
      >
        <div style={sectionLabel}>how it works</div>
        <pre style={codeBlockStyle}>
          {`// Route defines a validateSearch schema
export function validateSearch(raw) {
  const page = parseInt(raw.page, 10);
  const sort = raw.sort === "date" ? "date" : "name";
  const filter = raw.filter || undefined;
  if (!Number.isFinite(page) || page < 1)
    throw new Error("Invalid page");
  return { page, sort, filter };
}

// Loader receives validated, typed search
export async function loader({ search }) {
  return fetchUsersPage(search.page, search.sort, search.filter);
}

// Component reads typed search params
const { page, sort, filter } = useSearch();

// Merge mode (default) - preserves other params
router.navigate("/users", {
  search: (prev) => ({ ...prev, page: page + 1 }),
});

// Replace mode - throws away other params
router.navigate("/users", {
  search: { page: 1, sort: "name" },
  searchMode: "replace",
});

// Delete a param - set it to undefined
router.navigate("/users", {
  search: (prev) => ({ ...prev, filter: undefined }),
});`}
        </pre>
      </div>

      <div style={{ ...metaBlockStyle, marginTop: "6px" }}>
        <div>
          <span style={{ color: "var(--ink-faint)" }}>hook: </span>
          useSearch&lt;{`{ page, sort, filter }`}&gt;()
        </div>
        <div>
          <span style={{ color: "var(--ink-faint)" }}>schema: </span>
          validateSearch() &rarr; plain object (no Zod, but Zod works inside it)
        </div>
        <div>
          <span style={{ color: "var(--ink-faint)" }}>merge: </span>
          default &mdash; preserves unmentioned params
        </div>
        <div>
          <span style={{ color: "var(--ink-faint)" }}>replace: </span>
          searchMode: "replace" &mdash; uses only what you provided
        </div>
        <div>
          <span style={{ color: "var(--ink-faint)" }}>delete: </span>
          set param to undefined, it vanishes from the URL
        </div>
        <div>
          <span style={{ color: "var(--ink-faint)" }}>multi-route: </span>
          multiple routes can read different subsets of the same query string
        </div>
        <div>
          <span style={{ color: "var(--ink-faint)" }}>error: </span>
          validation failure skips the loader, shows error boundary
        </div>
      </div>
    </div>
  );
}
