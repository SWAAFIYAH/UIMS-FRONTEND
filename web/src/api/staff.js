import client from "./client";

// Change this path if the backend exposes staff under a different route.
const STAFF_ENDPOINT = "/staff/";

export async function getStaff() {
  const { data } = await client.get(STAFF_ENDPOINT);
  // Django REST Framework may return either an array or a paginated result.
  return Array.isArray(data) ? data : data.results ?? [];
}

export async function createStaff(staff) {
  const { data } = await client.post(
    "/auth/staff/create/",
    {
      email: staff.email,
      first_name: staff.first_name,
      last_name: staff.last_name,
      role: staff.role,
    }
  );

  return data;
}

export async function updateStaff(id, staff) {
  const { data } = await client.put(`${STAFF_ENDPOINT}${id}/`, staff);
  return data;
}

export async function removeStaff(id) {
  return client.delete(`${STAFF_ENDPOINT}${id}/`);
}
export async function resendStaffInvite(email) {
  const { data } = await client.post(
    "/auth/staff/resend-invite/",
    {
      email: email.trim(),
    }
  );

  return data;
}

export async function getSupervisors() {
  const { data } = await client.get("/internships/supervisors/");
  return data.results ?? [];
}

