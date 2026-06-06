// TODO: confirm auth header with Shivam — currently assuming Bearer JWT
import { getToken } from "./auth";

const BASE = import.meta.env.DEV ? "/api" : import.meta.env.VITE_API_BASE_URL?.trim();

async function otpFetch(path) {
  const token = await getToken();
  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json || json.responseCode !== 200) {
    throw new Error(json?.data?.messageDescription || `OTP API failed (${res.status})`);
  }
  return json;
}

export async function generateOtp(mobile) {
  const json = await otpFetch(`/generate-otp4-new?mobile=${mobile}`);
  return { IsRegistered: json.data.IsRegistered };
}

export async function loginWithOtp(mobile, otp) {
  const json = await otpFetch(`/otp-login?otp=${otp}&mobile=${mobile}`);
  return json.data;
}

export async function signUpWithOtp(mobile, otp, cityId) {
  const json = await otpFetch(`/otp-sign-up?otp=${otp}&city_id=${cityId}&mobile=${mobile}`);
  return json.data;
}

export async function getCities() {
  const json = await otpFetch("/get-ig-cities");
  return json.data.cities;
}
