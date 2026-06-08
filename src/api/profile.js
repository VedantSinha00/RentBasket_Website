// TODO: confirm auth header with Shivam — currently assuming Bearer JWT
import { authFetch } from "./client";

export async function updateUserProfile(data) {
  // Listed as GET in the API sheet but has a JSON body — treat as POST
  // data shape: { user_id, first_name, last_name, email, address, org_name, about_me, social_media_link, reg_mobile_num }
  const res = await authFetch("/update-user-profile", { method: "POST", body: data });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.data?.messageDescription || body?.message || `Profile update failed (${res.status})`);
  }
  return res.json();
}
