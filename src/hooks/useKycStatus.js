import { useState, useEffect } from "react";
import { getAuth } from "@/lib/auth";
import { getKycStatus, getKycDocList } from "@/api/kyc";

/**
 * Returns { kycDone, loading } for the currently logged-in user.
 * kycDone is null while loading, true if KYC is complete, false if not.
 */
export function useKycStatus() {
  const [kycDone, setKycDone] = useState(null);

  useEffect(() => {
    const mobile = getAuth()?.phone;
    if (!mobile) { setKycDone(false); return; }
    Promise.all([getKycStatus(mobile), getKycDocList(mobile)])
      .then(([kycData, docList]) => {
        const mandatoryDocs = (docList ?? []).filter((d) => d.mandatory === 1);
        const allDone = mandatoryDocs.length > 0 && mandatoryDocs.every((d) => !!d.is_done);
        // Treat as done as soon as all mandatory docs are uploaded — "Completed"
        // only flips after admin verification, which is an offline step.
        setKycDone(allDone);
      })
      .catch(() => setKycDone(false));
  }, []);

  return { kycDone, loading: kycDone === null };
}
