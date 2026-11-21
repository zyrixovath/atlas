
export async function api(path, options = {}) {
  try {
    const { headers = {}, ...fetchOptions } = options;

    const response = await fetch(`/api/${path.replace(/^\/+/, "")}`, {
      ...fetchOptions,
      headers: {
        "Content-Type": "application/json",
        ...headers
      },
      cache: "no-store"
    });

    const contentType = response.headers.get("content-type") || "";

    const data = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      throw new Error(
        `${response.status}: ${
          typeof data === "string"
            ? data
            : data.error || data.message || "API request failed"
        }`
      );
    }

    return data;

  } catch (error) {
    console.error("ATLAS API ERROR:", error);
    throw error;
  }
}

export const post = (path, body) =>
  api(path, {
    method: "POST",
    body: JSON.stringify(body)
  });
