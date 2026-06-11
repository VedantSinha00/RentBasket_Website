import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  ChevronLeft,
  CreditCard,
  Camera,
  FileText,
  Upload,
  Check,
  X,
  ShieldCheck,
  Lock,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import logo from "@/assets/7 1.png";
import { toast } from "sonner";
import { getAuth } from "@/lib/auth";
import { getKycStatus, getKycDocList, submitKycDoc } from "@/api/kyc";

function getDocIcon(docType) {
  if (docType === 1 || docType === 2) return CreditCard;
  if (docType === 5) return Camera;
  return FileText;
}

function getDocAccept(docType) {
  return docType === 7 ? "image/*,application/pdf" : "image/*";
}

const Kyc = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state?.orderData || null;

  const [docs, setDocs] = useState([]);
  // { [doc_type]: { name, isImage, url, file } }
  // file === null means pre-filled from API (no re-upload needed)
  const [files, setFiles] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadKycState = async () => {
    const mobile = getAuth()?.phone;
    if (!mobile) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError(false);
    try {
      const [kycData, docList] = await Promise.all([
        getKycStatus(mobile),
        getKycDocList(mobile),
      ]);

      const kycDetails = kycData.kyc_details ?? [];
      const mandatoryDocs = (docList ?? []).filter((d) => d.mandatory === 1);

      const allMandatoryDone = mandatoryDocs.every((d) => d.is_done === 1);
      if (kycDetails[0]?.status === "Completed" && allMandatoryDone) {
        navigate("/order-success", {
          state: { orderData, kycComplete: true },
          replace: true,
        });
        return;
      }

      // An empty doc list means the requirements couldn't be loaded — treat it
      // like a failure so the user gets a Retry instead of "Upload all 0 documents".
      if (mandatoryDocs.length === 0) {
        setLoadError(true);
        return;
      }

      setDocs(mandatoryDocs);

      const prefilledState = {};
      docList
        .filter((d) => d.mandatory === 1 && d.is_done === 1)
        .forEach((doc) => {
          prefilledState[doc.doc_type] = {
            name: doc.doc_type_name,
            isImage: true,
            url: doc.doc_path,
            file: null,
          };
        });
      setFiles(prefilledState);
    } catch (err) {
      setLoadError(true);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadKycState();
  }, []);

  // Revoke blob previews when files change or on unmount
  useEffect(() => {
    return () => {
      Object.values(files).forEach((f) => {
        if (f?.url?.startsWith("blob:")) URL.revokeObjectURL(f.url);
      });
    };
  }, [files]);

  const isDocReady = (doc) => Boolean(files[doc.doc_type]);
  const uploadedCount = docs.filter(isDocReady).length;
  const allUploaded = docs.length > 0 && docs.every(isDocReady);

  const handleSelect = (docType, fileList) => {
    const file = fileList?.[0];
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    setFiles((prev) => {
      const existing = prev[docType];
      if (existing?.url?.startsWith("blob:")) URL.revokeObjectURL(existing.url);
      return {
        ...prev,
        [docType]: { name: file.name, isImage, url: isImage ? URL.createObjectURL(file) : null, file },
      };
    });
  };

  const handleRemove = (docType) => {
    setFiles((prev) => {
      const existing = prev[docType];
      if (existing?.url?.startsWith("blob:")) URL.revokeObjectURL(existing.url);
      const next = { ...prev };
      delete next[docType];
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!allUploaded || isSubmitting) return;
    const mobile = getAuth()?.phone;
    if (!mobile) {
      toast.error("Session expired. Please sign in again.");
      navigate("/customer-validation", { state: { returnTo: "/kyc" } });
      return;
    }
    setIsSubmitting(true);
    try {
      for (const doc of docs) {
        const entry = files[doc.doc_type];
        if (!entry?.file) continue; // pre-filled — skip re-upload
        await submitKycDoc(mobile, doc.doc_type, entry.file);
      }
      toast.success("KYC verified — your order is confirmed!", {
        description: "Our team will reach out to schedule delivery.",
      });
      navigate("/order-success", { state: { orderData, kycComplete: true } });
    } catch (err) {
      toast.error(err.message || "Upload failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Minimal Navbar */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border py-4">
        <div className="section-container flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-105">
              <img src={logo} alt="RentBasket logo" className="w-24 md:w-28" />
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-2 text-success bg-success-muted px-3 py-1.5 rounded-full border border-success-border">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Encrypted & Secure</span>
          </div>
        </div>
      </header>

      <main className="section-container mt-4 md:mt-6">
        <div className="max-w-2xl mx-auto">
          {/* Back */}
          <Link
            to="/order-success"
            state={{ orderData }}
            className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back to Order
          </Link>

          {/* Heading */}
          <div className="mt-4 mb-6">
            <h1 className="text-2xl md:text-4xl font-black font-display text-foreground tracking-tight">
              Complete your KYC
            </h1>
            <p className="text-[11px] md:text-sm text-muted-foreground font-medium mt-1">
              Upload the required documents to verify your identity. This confirms your rental order
              {orderData?.orderId ? ` (#${orderData.orderId})` : ""}.
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span className="text-sm font-medium">Loading KYC status…</span>
            </div>
          ) : loadError ? (
            <div className="flex flex-col items-center text-center py-16 px-6 bg-card border border-border rounded-2xl">
              <div className="w-12 h-12 rounded-2xl bg-destructive-muted text-destructive flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Couldn't load your KYC requirements</h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm leading-relaxed">
                Something went wrong fetching the document list. Your order is safe — please try again.
              </p>
              <button
                onClick={loadKycState}
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-primary/30 text-sm font-bold text-primary hover:bg-primary/5 transition-colors active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          ) : (
            <>
              {/* Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {uploadedCount} of {docs.length} uploaded
                  </span>
                  {allUploaded && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-success">
                      <Check className="w-3.5 h-3.5" /> All documents ready
                    </span>
                  )}
                </div>
                <div className="h-2 w-full rounded-full bg-secondary/60 overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: docs.length ? `${(uploadedCount / docs.length) * 100}%` : "0%" }}
                  />
                </div>
              </div>

              {/* Upload tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {docs.map((doc) => {
                  const Icon = getDocIcon(doc.doc_type);
                  const uploaded = files[doc.doc_type];
                  const accept = getDocAccept(doc.doc_type);
                  return (
                    <div
                      key={doc.doc_type}
                      className={`relative rounded-2xl border-2 p-4 transition-all ${
                        uploaded
                          ? "border-success/40 bg-success-muted/40"
                          : "border-dashed border-border bg-card hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              uploaded ? "bg-success text-white" : "bg-primary/10 text-primary"
                            }`}
                          >
                            {uploaded ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground leading-tight">{doc.name}</p>
                            <p className="text-[10px] text-muted-foreground">{doc.user_prompt}</p>
                          </div>
                        </div>
                        {uploaded && (
                          <button
                            onClick={() => handleRemove(doc.doc_type)}
                            className="text-muted-foreground hover:text-destructive transition-colors p-1"
                            aria-label={`Remove ${doc.name}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {uploaded ? (
                        <div className="flex items-center gap-3 rounded-xl bg-background border border-border/60 p-2">
                          {uploaded.isImage && uploaded.url ? (
                            <img
                              src={uploaded.url}
                              alt={doc.name}
                              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                              <FileText className="w-5 h-5 text-muted-foreground" />
                            </div>
                          )}
                          <span className="text-xs font-medium text-foreground truncate">{uploaded.name}</span>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center gap-1.5 rounded-xl bg-secondary/30 border border-border/50 py-5 cursor-pointer hover:bg-secondary/50 transition-colors">
                          <Upload className="w-5 h-5 text-muted-foreground" />
                          <span className="text-xs font-bold text-primary">Upload</span>
                          <span className="text-[10px] text-muted-foreground">
                            {accept.includes("pdf") ? "Image or PDF" : "JPG / PNG"}
                          </span>
                          <input
                            type="file"
                            accept={accept}
                            className="hidden"
                            onChange={(e) => handleSelect(doc.doc_type, e.target.files)}
                          />
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Privacy note */}
              <div className="mt-5 flex items-start gap-2 text-[11px] text-muted-foreground bg-primary/5 border border-primary/10 rounded-xl p-3">
                <Lock className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                <span>
                  Your documents are encrypted and used only for identity verification as per RentBasket's rental terms.
                </span>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={!allUploaded || isSubmitting}
                className="gradient-coral w-full py-4 mt-6 rounded-2xl font-black text-lg shadow-lg shadow-primary/30 transition-all hover:shadow-primary/40 hover:opacity-95 active:scale-[0.98] disabled:opacity-60 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Uploading documents…
                  </>
                ) : allUploaded ? (
                  <>Submit &amp; Confirm Order <ShieldCheck className="w-5 h-5" /></>
                ) : (
                  `Upload all ${docs.length} documents to continue`
                )}
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Kyc;
