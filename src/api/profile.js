// TODO: confirm auth header with Shivam — currently assuming Bearer JWT
import { getToken, clearToken } from "./auth";

const BASE = import.meta.env.DEV ? "/api" : import.meta.env.VITE_API_BASE_URL?.trim();

export async function updateUserProfile(data) {
  // Listed as GET in the API sheet but has a JSON body — treat as POST
  // data shape: { user_id, first_name, last_name, email, address, org_name, about_me, social_media_link, reg_mobile_num }
  const token = await getToken();
  let res = await fetch(`${BASE}/update-user-profile`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (res.status === 401) {
    clearToken();
    const fresh = await getToken();
    res = await fetch(`${BASE}/update-user-profile`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${fresh}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.data?.messageDescription || body?.message || `Profile update failed (${res.status})`);
  }
  return res.json();
}
