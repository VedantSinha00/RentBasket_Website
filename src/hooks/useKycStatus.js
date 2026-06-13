import { useState, useEffect } from "react";
import { getAuth } from "@/lib/auth";
import { getKycStatus, getKycDocList } from "@/api/kyc";

/**
 * Returns { kycStatus, loading } for the currently logged-in user.
 *
 * kycStatus:
 *   null        — still loading
 *   "none"      — docs not yet uploaded
 *   "submitted" — all mandatory docs uploaded, awaiting admin verification
 *   "verified"  — backend status === "Completed" (admin approved)
 */
export function useKycStatus() {
  const [kycStatus, setKycStatus] = useState(null);

  useEffect(() => {
    const mobile = getAuth()?.phone;
    if (!mobile) { setKycStatus("none"); return; }
    Promise.all([getKycStatus(mobile), getKycDocList(mobile)])
      .then(([kycData, docList]) => {
        const mandatoryDocs = (docList ?? []).filter((d) => d.mandatory === 1);
        const allUploaded = mandatoryDocs.length > 0 && mandatoryDocs.every((d) => !!d.is_done);
        const adminVerified = kycData?.kyc_details?.[0]?.status === "Completed";
        if (adminVerified) setKycStatus("verified");
        else if (allUploaded) setKycStatus("submitted");
        else setKycStatus("none");
      })
      .catch(() => setKycStatus("none"));
  }, []);

  return { kycStatus, loading: kycStatus === null };
}
