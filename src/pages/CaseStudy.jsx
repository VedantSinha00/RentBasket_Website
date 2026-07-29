import { Building2, TrendingUp, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Placeholder content — real case studies to be added later.
const caseStudies = [
  {
    icon: Building2,
    title: "Coming soon",
    summary: "We're putting together real stories of homes and offices we've furnished across Gurgaon and Noida — the brief, the setup, and the outcome.",
    stat: "—",
    statLabel: "Details coming soon",
  },
];

const CaseStudy = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <Header />
        <main className="w-full bg-white py-12 md:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-foreground mb-3">
                Case Studies
              </h1>
              <p className="text-muted-foreground font-sans text-sm sm:text-base max-w-md mx-auto">
                A closer look at how RentBasket furnishes homes and workspaces across Delhi NCR.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              {caseStudies.map((study, i) => {
                const Icon = study.icon;
                return (
                  <div
                    key={i}
                    className="bg-cream rounded-3xl p-6 sm:p-10 shadow-soft flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-mint text-jade-ink flex items-center justify-center shrink-0">
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-display font-semibold text-xl sm:text-2xl text-ink mb-2">
                        {study.title}
                      </h2>
                      <p className="font-sans text-sm sm:text-base text-ink-muted leading-relaxed">
                        {study.summary}
                      </p>
                    </div>
                    <div className="text-center md:text-right shrink-0">
                      <p className="font-display font-bold text-2xl sm:text-3xl text-jade-ink">
                        {study.stat}
                      </p>
                      <p className="font-sans text-xs text-ink-muted mt-1">{study.statLabel}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Placeholder metric strip to keep the page from feeling empty
                while real case studies are being written up */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-mint-pale rounded-2xl p-6 text-center">
                <Users className="w-6 h-6 text-jade-ink mx-auto mb-2" />
                <p className="font-display font-bold text-xl text-ink">500+</p>
                <p className="font-sans text-xs text-ink-muted mt-1">Homes furnished</p>
              </div>
              <div className="bg-sky rounded-2xl p-6 text-center">
                <Building2 className="w-6 h-6 text-jade-ink mx-auto mb-2" />
                <p className="font-display font-bold text-xl text-ink">2</p>
                <p className="font-sans text-xs text-ink-muted mt-1">Cities served (Gurgaon &amp; Noida)</p>
              </div>
              <div className="bg-sand rounded-2xl p-6 text-center">
                <TrendingUp className="w-6 h-6 text-jade-ink mx-auto mb-2" />
                <p className="font-display font-bold text-xl text-ink">4.9★</p>
                <p className="font-sans text-xs text-ink-muted mt-1">Average customer rating</p>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default CaseStudy;
