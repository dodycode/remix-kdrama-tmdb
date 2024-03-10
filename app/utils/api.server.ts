export const api = async (
  APIUrl: string,
  method: string = "GET",
  token?: string,
  body?: any
) => {
  //call API
  const response = await fetch(APIUrl, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` || "",
    },
    body: method === "GET" ? undefined : JSON.stringify(body),
  });

  const result: {
    page?: number;
    results?: any[];
    total_pages?: number;
    total_results?: number;
  } = await response.json();

  return result;
};
