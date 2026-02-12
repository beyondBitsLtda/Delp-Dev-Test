// supabaseRest.js
// Minimal Supabase REST (PostgREST) client using fetch.
// Uses anon key (OK for local tests with open dev policies).

export function createSupabaseRestClient({ supabaseUrl, anonKey, schema = "public" }) {
  if (!supabaseUrl || !anonKey) {
    throw new Error("Supabase URL and anonKey are required.");
  }

  const baseUrl = supabaseUrl.replace(/\/+$/, "");
  const defaultHeaders = {
    "apikey": anonKey,
    "Authorization": `Bearer ${anonKey}`,
    "Content-Type": "application/json",
    "Accept": "application/json",
  };

  async function request(path, { method = "GET", headers = {}, body } = {}) {
    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers: { ...defaultHeaders, ...headers },
      body: body ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    if (!res.ok) {
      const msg = data?.message || data?.hint || data?.details || res.statusText;
      throw new Error(`Supabase REST error (${res.status}): ${msg}`);
    }

    return data;
  }

  // Helpers
  function encodeEq(column, value) {
    return `${encodeURIComponent(column)}=eq.${encodeURIComponent(value)}`;
  }

  return {
    async select(table, { select = "*", filters = {}, orderBy, ascending = true, limit } = {}) {
      const params = [`select=${encodeURIComponent(select)}`];

      for (const [col, val] of Object.entries(filters)) {
        params.push(encodeEq(col, val));
      }

      if (orderBy) {
        params.push(`order=${encodeURIComponent(orderBy)}.${ascending ? "asc" : "desc"}`);
      }

      if (typeof limit === "number") {
        params.push(`limit=${limit}`);
      }

      const qs = params.length ? `?${params.join("&")}` : "";
      return request(`/rest/v1/${table}${qs}`, {
        method: "GET",
        headers: { "Accept-Profile": schema },
      });
    },

    async insert(table, rows) {
      return request(`/rest/v1/${table}`, {
        method: "POST",
        headers: {
          "Prefer": "return=representation",
          "Content-Profile": schema,
        },
        body: Array.isArray(rows) ? rows : [rows],
      });
    },

    async update(table, { filters = {}, patch }) {
      const params = [];
      for (const [col, val] of Object.entries(filters)) {
        params.push(encodeEq(col, val));
      }
      const qs = params.length ? `?${params.join("&")}` : "";
      return request(`/rest/v1/${table}${qs}`, {
        method: "PATCH",
        headers: {
          "Prefer": "return=representation",
          "Content-Profile": schema,
        },
        body: patch,
      });
    },

    async remove(table, { filters = {} }) {
      const params = [];
      for (const [col, val] of Object.entries(filters)) {
        params.push(encodeEq(col, val));
      }
      const qs = params.length ? `?${params.join("&")}` : "";
      return request(`/rest/v1/${table}${qs}`, {
        method: "DELETE",
        headers: {
          "Prefer": "return=representation",
          "Content-Profile": schema,
        },
      });
    },
  };
}
