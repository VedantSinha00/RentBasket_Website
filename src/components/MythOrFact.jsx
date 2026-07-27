import { useState, useRef, useEffect } from "react";
import { Check, X, ArrowRight, RefreshCw, Zap, Truck, Wrench, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent, useSpring, useReducedMotion } from "framer-motion";
import kuMascot from "@/assets/ku-pondering.png";

// ── QUIZ CONTENT ──────────────────────────────────────────
// Lens: "why RentBasket over other rental services" (not "why rent vs buy").
// Each myth is a doubt about what a rental service can do; RentBasket does it.
// All myths are FALSE. See docs/quiz-hidden-costs-spec.md §5 for reasoning.
const QUIZ_QUESTIONS = [
  {
    id: 1,
    // Q1 — speed. Differentiator: same-day / fast delivery.
    myth: "Renting furniture means waiting days for it to arrive.",
    answer: false,
    explanation:
      "RentBasket delivers in about 36 hours on average, and often the same day. No long waits.",
  },
  {
    id: 2,
    // Q2 — flexibility + free relocation.
    myth: "Once you rent, you're locked in, and moving flats means paying to haul it all.",
    answer: false,
    explanation:
      "Flexible plans from 3 to 12 months, plus free relocation support. When you move, we move your rented furniture with you.",
  },
  {
    id: 3,
    // Q3 — free maintenance + quick service.
    myth: "If a rented appliance stops working, repairs are slow and cost you extra.",
    answer: false,
    explanation:
      "Maintenance is included at no cost, and our service team resolves issues fast. No repair bills, no long waits.",
  },
  {
    id: 4,
    // Q4 — quality (still reassuring vs rivals who send worn stock).
    myth: "Rental furniture is always old, worn out, or second-rate.",
    answer: false,
    explanation:
      "Every RentBasket item is new or in mint condition, sanitized and quality-checked before it reaches you.",
  },
];

// ── DESKTOP MYTH CARDS ─────────────────────────────────────
// Same 4 themes as the mobile quiz (QUIZ_QUESTIONS above), reworded as
// belief/reality pairs with a stat badge so desktop readers get the same
// hard numbers mobile users get after answering.
const DESKTOP_MYTHS = [
  {
    icon: Zap,
    statBadge: "~36h Delivery",
    belief: "Renting furniture means waiting days for it to arrive.",
    reality:
      "RentBasket delivers in about 36 hours on average, and often the same day. No long waits.",
  },
  {
    icon: Truck,
    statBadge: "₹0 Relocation Fee",
    belief: "Once you rent, you're locked in, and moving flats means paying to haul it all.",
    reality:
      "Flexible plans from 3 to 12 months, plus free relocation support. When you move, we move your rented furniture with you.",
  },
  {
    icon: Wrench,
    statBadge: "₹0 Maintenance Cost",
    belief: "If a rented appliance stops working, repairs are slow and cost you extra.",
    reality:
      "Maintenance is included at no cost, and our service team resolves issues fast. No repair bills, no long waits.",
  },
  {
    icon: Sparkles,
    statBadge: "Mint Condition",
    belief: "Rental furniture is always old, worn out, or second-rate.",
    reality:
      "Every RentBasket item is new or in mint condition, sanitized and quality-checked before it reaches you.",
  },
];

// ── COMPARISON CHECKLIST (vs BUYING) ──────────────────────
// Real figures from the founder's Smart LED 43" TV example.
// NOTE: renting takes a refundable deposit — do NOT claim "zero deposit".
const COMPARISON_EXAMPLE = "Smart LED 43\" TV";
const COMPARISON_ITEMS = [
  {
    feature: "The product",
    buying: "₹30,000+ to buy outright",
    renting: "₹881/mo, no big upfront hit",
  },
  {
    feature: "Delivery & installation",
    buying: "₹500 delivery + ₹1,000 install",
    renting: "Free. We deliver & set it up",
  },
  {
    feature: "Maintenance",
    buying: "~₹1,000/yr out of pocket",
    renting: "Included, free",
  },
];
// Totals for the closing line (from the same TV example).
const COMPARISON_TOTALS = {
  buying: "₹41,500+",
  renting: "₹881/mo",
  breakEven: "48 months (4 years)",
};
// ──────────────────────────────────────────────────────────

// ── MOBILE-ONLY QUIZ SECTION (SCROLL-DRIVEN) ──────────────
// Only rendered on < lg screens.
// Standard state machine: intro → quiz → results.
// Morphs from card layout to full viewport takeover based on scroll progress.
const MobileQuizSection = () => {
  const [phase, setPhase] = useState("intro"); // "intro" | "quiz" | "results"
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null); // null | boolean
  const [score, setScore] = useState(0);

  const currentQuestion = QUIZ_QUESTIONS[qIndex];
  const answered = selected !== null;
  const isLastQuestion = qIndex === QUIZ_QUESTIONS.length - 1;

  const handleStart = () => {
    setPhase("quiz");
    setQIndex(0);
    setSelected(null);
    setScore(0);
  };

  const handleAnswer = (value) => {
    if (answered) return;
    setSelected(value);
    if (value === currentQuestion.answer) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setPhase("results");
    } else {
      setQIndex((i) => i + 1);
      setSelected(null);
    }
  };

  return (
    <div className="lg:hidden py-12 px-4 bg-cream border-y border-border/30">
      <div className="max-w-md mx-auto flex flex-col gap-5 items-center">
        <div className="text-center flex flex-col gap-1">
          <span className="text-xs font-bold text-jade-ink uppercase tracking-wider">
            30-Second Quiz
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-ink">
            Myth or Reality?
          </h2>
        </div>

        <div className="w-full bg-white border border-border/60 rounded-[24px] p-6 shadow-card min-h-[360px] flex flex-col justify-between relative overflow-hidden">
          <AnimatePresence mode="wait">
            {phase === "intro" && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center text-center flex-1 gap-5 py-2"
              >
                <img
                  src={kuMascot}
                  alt="RentBasket Mascot"
                  className="w-24 h-24 object-contain -mb-1"
                  loading="eager"
                />
                <div className="flex flex-col gap-2">
                  <h3 className="font-display font-semibold text-ink text-lg leading-snug">
                    Is renting actually a waste of money?
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-ink-muted max-w-xs mx-auto leading-relaxed">
                    Test your knowledge on rental delivery, maintenance, and real upfront cost math.
                  </p>
                </div>
                <button
                  onClick={handleStart}
                  className="btn-pine w-full py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Start 30-Sec Quiz
                </button>
              </motion.div>
            )}

            {phase === "quiz" && (
              <motion.div
                key={`q-${qIndex}`}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col justify-between flex-1 gap-4"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[10px] font-bold text-ink-muted uppercase tracking-wider">
                    <span>Myth {qIndex + 1} of {QUIZ_QUESTIONS.length}</span>
                    <span>Score: {score}</span>
                  </div>
                  <div className="w-full h-1.5 bg-mint-pale rounded-full overflow-hidden">
                    <div
                      className="h-full bg-jade transition-all duration-300 rounded-full"
                      style={{ width: `${((qIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4 my-auto py-1">
                  <h3 className="font-display font-semibold text-ink text-base leading-snug">
                    "{currentQuestion.myth}"
                  </h3>

                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { label: "True", value: true },
                      { label: "False", value: false },
                    ].map((opt) => {
                      const isChosen = selected === opt.value;
                      const isCorrect = opt.value === currentQuestion.answer;

                      let styles = "border-border bg-white text-ink hover:bg-mint-pale";
                      if (answered) {
                        if (isCorrect) {
                          styles = "border-jade bg-mint-pale text-jade-ink font-bold";
                        } else if (isChosen) {
                          styles = "border-destructive bg-destructive/10 text-destructive";
                        } else {
                          styles = "border-border/40 opacity-40";
                        }
                      }

                      return (
                        <button
                          key={opt.label}
                          disabled={answered}
                          onClick={() => handleAnswer(opt.value)}
                          className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-sm font-semibold transition-all active:scale-95 ${styles}`}
                        >
                          <span>{opt.label}</span>
                          {answered && isCorrect && <Check className="w-4 h-4 shrink-0 text-jade-ink" />}
                          {answered && isChosen && !isCorrect && <X className="w-4 h-4 shrink-0 text-destructive" />}
                        </button>
                      );
                    })}
                  </div>

                  {answered && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="bg-mint-pale/70 rounded-xl p-3.5 border border-jade/20 text-left flex flex-col gap-1 mt-1"
                    >
                      <span className="text-[10px] font-bold text-jade-ink uppercase tracking-wider">
                        The Reality
                      </span>
                      <p className="font-sans text-xs text-ink leading-relaxed">
                        {currentQuestion.explanation}
                      </p>
                    </motion.div>
                  )}
                </div>

                <div className="flex justify-end pt-2">
                  {answered ? (
                    <button
                      onClick={handleNext}
                      className="btn-pine w-full py-2.5 text-xs justify-center"
                    >
                      <span>{isLastQuestion ? "See Math Results" : "Next Myth"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-[11px] text-ink-muted text-center w-full">
                      Tap True or False to continue
                    </span>
                  )}
                </div>
              </motion.div>
            )}

            {phase === "results" && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col justify-between flex-1 gap-3 text-center"
              >
                <div>
                  <h3 className="font-display font-bold text-ink text-xl">
                    Myths Busted!
                  </h3>
                  <p className="font-sans text-xs text-ink-muted mt-0.5">
                    You scored <span className="font-bold text-jade-ink">{score} of {QUIZ_QUESTIONS.length}</span> right. Here is the cost comparison:
                  </p>
                </div>

                <div className="border border-border/60 rounded-xl overflow-hidden text-xs my-1 bg-white">
                  <div className="grid grid-cols-[1.1fr_1fr_1fr] gap-1 px-3 py-2 bg-mint-pale text-[9px] font-bold uppercase tracking-wider text-jade-ink text-left">
                    <span>Item</span>
                    <span>Buying</span>
                    <span>RentBasket</span>
                  </div>
                  <div className="divide-y divide-border/40 text-left">
                    {COMPARISON_ITEMS.map((item, idx) => (
                      <div key={idx} className="grid grid-cols-[1.1fr_1fr_1fr] gap-1 px-3 py-2 text-[11px]">
                        <span className="font-medium text-ink truncate">{item.feature}</span>
                        <span className="text-ink-muted">{item.buying}</span>
                        <span className="font-semibold text-jade-ink">{item.renting}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <Link to="/catalog" className="w-full">
                    <button className="btn-pine w-full py-2.5 text-xs justify-center">
                      Browse Catalogue
                    </button>
                  </Link>
                  <button
                    onClick={handleStart}
                    className="flex items-center justify-center gap-1.5 text-xs text-ink-muted hover:text-ink font-semibold py-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Try Again</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const MythOrFact = () => {
  return (
    <>
      {/* ── Desktop (≥ lg): 2-column editorial split, drenched pine (§5.6) ── */}
      <section id="myth-section" className="hidden lg:block py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-pine">
        <div className="grid grid-cols-[1fr_2fr] gap-16 max-w-7xl mx-auto">
          {/* Left column: sticky title + CTA */}
          <div className="flex flex-col items-start text-left gap-6 lg:sticky lg:top-28 h-fit max-w-sm">
            <div className="flex flex-col gap-3">
              <h2 className="font-display text-4xl xl:text-5xl font-semibold text-white tracking-tight leading-[1.15]">
                Myth or reality? Let's address the doubts.
              </h2>
              <p className="font-sans text-sm text-mint leading-relaxed mt-2">
                Renting home furniture and appliances comes with common myths. Here is the math and the reality behind how we make relocation effortless.
              </p>
            </div>
            <Link to="/catalog">
              <button className="btn-jade px-8 h-12 text-sm">
                Browse Catalogue
              </button>
            </Link>
          </div>

          {/* Right column: comparative rows */}
          <div className="flex flex-col gap-6">
            {DESKTOP_MYTHS.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="group relative flex flex-row gap-8 bg-white rounded-2xl p-6 pt-8 shadow-elevated border border-transparent hover:-translate-y-1 hover:border-mint/60 transition-all duration-300"
                >
                  {/* Icon + Stat chip */}
                  <div className="absolute top-4 right-6 flex items-center gap-1.5 bg-mint-pale text-jade-ink pl-2 pr-3 py-1 rounded-full">
                    <Icon className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span className="font-sans text-[11px] font-bold tracking-tight">
                      {item.statBadge}
                    </span>
                  </div>

                  {/* Belief */}
                  <div className="flex-1 flex flex-col gap-2">
                    <span className="inline-flex items-center gap-1 w-fit font-sans text-[9px] font-bold text-destructive bg-destructive/10 uppercase tracking-widest leading-none px-2 py-1 rounded-full">
                      Myth
                    </span>
                    <p className="font-sans text-sm xl:text-base text-ink-muted font-medium leading-relaxed">
                      "{item.belief}"
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="w-[1px] bg-border shrink-0 self-stretch" />

                  {/* Reality */}
                  <div className="flex-1 flex flex-col gap-2">
                    <span className="inline-flex items-center gap-1 w-fit font-sans text-[9px] font-bold text-white bg-jade-ink uppercase tracking-widest leading-none px-2 py-1 rounded-full">
                      <Check className="w-3 h-3 stroke-[3.5]" />
                      Reality
                    </span>
                    <p className="font-sans text-sm xl:text-[15px] text-ink font-semibold leading-relaxed">
                      {item.reality}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* 5th card: the math promised in the left-column subtitle */}
            <div className="flex flex-col gap-5 bg-pine rounded-2xl p-6 shadow-elevated">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-white tracking-tight">
                  The math, worked out
                </h3>
                <span className="font-sans text-[10px] font-bold text-mint uppercase tracking-widest">
                  {COMPARISON_EXAMPLE}
                </span>
              </div>

              <div className="border border-white/10 rounded-xl overflow-hidden font-sans text-sm">
                <div className="grid grid-cols-[1.1fr_1fr_1fr] gap-2 px-4 py-2.5 bg-white/5 text-[10px] uppercase tracking-wider font-bold text-mint">
                  <span>Cost Item</span>
                  <span>Buying</span>
                  <span>RentBasket</span>
                </div>
                <div className="divide-y divide-white/10">
                  {COMPARISON_ITEMS.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-[1.1fr_1fr_1fr] gap-2 px-4 py-3">
                      <span className="font-medium text-white/90">{item.feature}</span>
                      <span className="text-white/50">{item.buying}</span>
                      <span className="text-mint font-semibold">{item.renting}</span>
                    </div>
                  ))}
                  <div className="grid grid-cols-[1.1fr_1fr_1fr] gap-2 px-4 py-3.5 bg-white/5 border-t border-white/10">
                    <span className="font-bold text-white">Total</span>
                    <span className="font-bold text-white/60">{COMPARISON_TOTALS.buying}</span>
                    <span className="font-display font-bold text-jade text-base leading-none">
                      {COMPARISON_TOTALS.renting}
                    </span>
                  </div>
                </div>
              </div>

              <p className="font-sans text-xs text-mint/80 leading-relaxed">
                That's <span className="font-bold text-white">{COMPARISON_TOTALS.breakEven}</span> of renting before buying even breaks even — no hassle of selling or relocation charges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mobile & tablet (< lg): interactive quiz with scroll-driven expansion ── */}
      <MobileQuizSection />
    </>
  );
};

export default MythOrFact;
