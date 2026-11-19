
import client from "./client";

export async function getPlacements(status = "All") {
  const params = {};

  if (status && status !== "All") {
    params.status = status.toLowerCase();
  }

  const { data } = await client.get(
    "/internships/placements/all/",
    { params }
  );

  return Array.isArray(data) ? data : data.results ?? [];
}
