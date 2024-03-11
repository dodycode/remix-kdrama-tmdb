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

  const result = await response.json();

  return result;
};
