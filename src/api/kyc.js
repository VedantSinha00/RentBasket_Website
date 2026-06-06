// TODO: confirm auth header with Shivam — currently assuming Bearer JWT
import { getToken, clearToken } from "./auth";

const BASE = import.meta.env.DEV ? "/api" : import.meta.env.VITE_API_BASE_URL?.trim();
const AWS_BASE = "https://testaws.rentbasket.com"; // update-kyc lives here

async function apiFetch(path) {
  const token = await getToken();
  let res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) {
    clearToken();
    const fresh = await getToken();
    res = await fetch(`${BASE}${path}`, {
      headers: { Authorization: `Bearer ${fresh}` },
    });
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.data?.messageDescription || `KYC API failed (${res.status})`);
  }
  return res.json();
}

export async function getKycStatus(mobile) {
  const json = await apiFetch(`/kyc?mobile=${encodeURIComponent(mobile)}`);
  return json.data;
}

export async function getKycDocList(mobile) {
  const json = await apiFetch(`/get-kyc-doc-list?mobile=${encodeURIComponent(mobile)}`);
  return json.data.kyc_docs ?? [];
}

export async function submitKycDoc(mobile, docType, file) {
  const token = await getToken();
  const form = new FormData();
  form.append("mobile", mobile);
  form.append("doc_type", docType);
  form.append("kyc_pic", file);
  const res = await fetch(`${AWS_BASE}/update-kyc`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.data?.messageDescription || `KYC upload failed (${res.status})`);
  }
  return res.json();
}
