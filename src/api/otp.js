import { authFetch } from "./client";

async function otpFetch(path) {
  const res = await authFetch(path, { retry: false });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json || json.responseCode !== 200) {
    throw new Error(json?.data?.messageDescription || `OTP API failed (${res.status})`);
  }
  return json;
}

// Email OTP endpoints return {status: boolean, message: string} — different shape
// from the mobile OTP endpoints above which use {responseCode, data}.
async function emailOtpFetch(path, method = "POST") {
  const res = await authFetch(path, { method, retry: false });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new Error(json?.message || `Email OTP API failed (${res.status})`);
  if (!json?.status) throw new Error(json?.message || "Request failed");
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

export async function getDeliverySlots() {
  const json = await otpFetch("/get-delivery-slots");
  return json.data.slots; // [{id, slot_name, from, to}]
}

export async function sendEmailOtp(email) {
  await emailOtpFetch(`/send-email-otp?email=${encodeURIComponent(email)}`);
}

export async function verifyEmailOtp(email, otp) {
  await emailOtpFetch(`/verify-email?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`);
}
