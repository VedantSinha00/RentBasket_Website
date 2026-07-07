import { useState, useEffect, useRef } from "react";
import { HelpCircle, Check, X, ArrowRight, ShieldCheck, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// ── QUIZ CONTENT ──────────────────────────────────────────
// Sourced from the founder's real customer objections. All myths are FALSE.
// See docs/quiz-hidden-costs-spec.md §5 for the reasoning behind each.
const QUIZ_QUESTIONS = [
  {
    id: 1,
    // Q1 — furnished-home shopper. Villain = the furnished lease (cost + choice).
    myth: "A fully furnished rental home is the cheaper, smarter option.",
    answer: false,
    explanation:
      "Furnished homes bake inflated appliance rent into your lease, and you get zero say in what you're given. Renting your own furniture works out cheaper over a typical stay — and you choose every single piece.",
  },
  {
    id: 2,
    // Q2 — outright buyer. Villain = ownership (upfront + depreciation + resale).
    myth: "If you'll use it for a while, buying furniture is cheaper than renting.",
    answer: false,
    explanation:
      "Buying means a big upfront hit, and it starts losing resale value the moment you use it. For stays up to ~30 months, renting costs less overall — and when you move, you just hand it back instead of selling at a loss.",
  },
  {
    id: 3,
    // Q3 — maintenance is included (customers don't know this).
    myth: "If something breaks, repairs and maintenance cost you extra.",
    answer: false,
    explanation:
      "Maintenance and repairs are part of the rental — handled fast, at no additional cost to you.",
  },
  {
    id: 4,
    // Q4 — product quality (a top blocker per the founder).
    myth: "Rental furniture is always old, worn out, or second-rate.",
    answer: false,
    explanation:
      "Every item is new or in mint condition — sanitized and quality-checked before it reaches your door.",
  },
];

// ── COMPARISON CHECKLIST ──────────────────────────────────
// PLACEHOLDER NUMBERS. Real figures pending from the founder —
// see docs/checklist-content-request.md. Swap the ₹[X] values.
const COMPARISON_ITEMS = [
  {
    feature: "Upfront cash",
    buying: "₹[X]+ paid up front",
    renting: "₹0 down, pay monthly",
  },
  {
    feature: "Maintenance & repairs",
    buying: "You pay every time",
    renting: "Included, free",
  },
  {
    feature: "When you move out",
    buying: "Lose ₹[X] on resale",
    renting: "Just hand it back",
  },
];
// ──────────────────────────────────────────────────────────

const Card = ({ belief, reality }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  // Mobile/tablet: card tilts to 30° (not a flip) while centred in the viewport
  const [isCentered, setIsCentered] = useState(false);
  const cardRef = useRef(null);

  // Mirror the lg breakpoint (1024px) used throughout the catalog. Use matchMedia
  // (not window.innerWidth) so this stays in lock-step with the CSS `lg:` classes
  // under browser zoom / display scaling — reading innerWidth drifts out of sync
  // with the media query at non-100% zoom and flips the layout at the wrong point.
  const [isMobileLayout, setIsMobileLayout] = useState(
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 1023px)").matches
      : false
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const onChange = (e) => setIsMobileLayout(e.matches);
    setIsMobileLayout(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Mobile/tablet: tilt (30°) when the card centre crosses the middle 40% of the viewport.
  // This is only a passive peek — a full flip still requires a tap.
  useEffect(() => {
    if (!isMobileLayout) {
      setIsCentered(false);
      return;
    }
    const el = cardRef.current;
    if (!el) return;

    const check = () => {
      const { top, height } = el.getBoundingClientRect();
      const cardCenter = top + height / 2;
      const vh = window.innerHeight;
      setIsCentered(cardCenter > vh * 0.3 && cardCenter < vh * 0.7);
    };

    window.addEventListener("scroll", check, { passive: true });
    check(); // run once on mount in case card is already centred
    return () => window.removeEventListener("scroll", check);
  }, [isMobileLayout]);

  const handleInteraction = () => {
    setIsFlipped((prev) => !prev);
  };

  // The tilt should never show while the card is flipped to the reality side.
  const showTilt = isCentered && !isFlipped;

  return (
    <div
      ref={cardRef}
      className="group h-[260px] sm:h-[300px] md:h-[320px] w-full [perspective:1000px] cursor-pointer"
      onClick={handleInteraction}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleInteraction();
        }
      }}
    >
      <div
        className={`relative h-full w-full rounded-2xl transition-all duration-700 [transform-style:preserve-3d] shadow-soft group-hover:shadow-card ${
          isFlipped
            ? "[transform:rotateY(180deg)]"
            : showTilt
            ? "[transform:rotateY(30deg)] shadow-card"
            : "lg:group-hover:[transform:rotateY(30deg)]"
        }`}
      >
        {/* FRONT SIDE (BELIEF - RED GRADIENT) */}
        <div
          className="absolute inset-0 h-full w-full rounded-2xl bg-gradient-to-br from-[#DF252F] via-[#E61E2A] to-[#B51019] p-6 sm:p-8 flex flex-col items-center justify-center text-center overflow-hidden border border-primary/20"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(0deg)",
          }}
        >
          {/* Decorative faint background icon */}
          <HelpCircle className="absolute -right-4 -bottom-4 w-24 h-24 text-white/[0.04] stroke-[1] pointer-events-none" />

          {/* Belief Label - Absolutely positioned to sit exactly in the top gap */}
          <div className="absolute top-6 sm:top-8 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 text-white rounded-full font-sans font-extrabold tracking-widest text-[11px] sm:text-xs uppercase border border-white/20 shadow-sm z-20">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Belief
          </div>

          {/* Belief Text */}
          <h3 className="text-white text-base sm:text-lg md:text-xl font-sans font-extrabold leading-snug px-2 sm:px-4 z-10 text-balance">
            "{belief}"
          </h3>

          {/* Flip Hint */}
          <p className="absolute bottom-4 text-[10px] font-sans font-bold text-white/70 tracking-wider uppercase">
            {isMobileLayout ? "Tap to reveal truth ↗" : "Hover to reveal truth ↗"}
          </p>
        </div>

        {/* BACK SIDE (REALITY - WARM CREAM) */}
        <div
          className="absolute inset-0 h-full w-full rounded-2xl bg-[#FCFAF7] border border-border/80 p-6 sm:p-8 flex flex-col items-center justify-center text-center overflow-hidden transition-colors group-hover:border-primary/20"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Decorative faint background check */}
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-primary/[0.02] rounded-full flex items-center justify-center pointer-events-none">
            <Check className="w-16 h-16 text-primary stroke-[3]" />
          </div>

          {/* Reality Label - Symmetrical absolute positioning */}
          <div className="absolute top-6 sm:top-8 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1 bg-red-100/80 text-primary rounded-full font-sans font-extrabold tracking-widest text-[11px] sm:text-xs uppercase border border-primary/15 shadow-sm z-20">
            ★ Reality
          </div>

          {/* Reality Text */}
          <p className="text-neutral-900 text-sm sm:text-base md:text-[16px] leading-relaxed font-sans font-semibold z-10 px-2 text-balance">
            {reality}
          </p>

          {/* Flip Hint */}
          <p className="absolute bottom-4 text-[10px] font-sans font-bold text-muted-foreground/60 tracking-wider uppercase flex items-center gap-1 group-hover:text-primary transition-colors">
            Click to flip back ↺
          </p>
        </div>
      </div>
    </div>
  );
};

// ── MOBILE-ONLY QUIZ ──────────────────────────────────────
// Shown < lg (see MythOrFact wrapper: `lg:hidden`). Desktop keeps the flip cards.
// State machine: intro → quiz → results. See docs/quiz-hidden-costs-spec.md.
const MythQuiz = () => {
  const [phase, setPhase] = useState("intro"); // "intro" | "quiz" | "results"
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null); // null | boolean (the tapped answer)
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
    if (answered) return; // lock: no re-answering
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
    <div className="max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {/* PHASE 1 — INTRO */}
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="text-center bg-cream border border-border rounded-2xl p-6 sm:p-8 flex flex-col items-center gap-6 shadow-soft"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-display text-2xl font-semibold text-foreground tracking-tight">
                Think you know renting?
              </h3>
              <p className="font-sans text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
                Take our 30-second myth-buster and see how many common beliefs about renting furniture you get right.
              </p>
            </div>
            <button
              onClick={handleStart}
              className="btn-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Start Quiz
            </button>
          </motion.div>
        )}

        {/* PHASE 2 — QUIZ */}
        {phase === "quiz" && (
          <motion.div
            key={`q-${qIndex}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-background border border-border rounded-2xl p-6 sm:p-8 shadow-soft flex flex-col gap-6"
          >
            {/* Progress */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <span>Myth {qIndex + 1} of {QUIZ_QUESTIONS.length}</span>
                <span>Score: {score}</span>
              </div>
              <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${((qIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Myth statement */}
            <div className="flex flex-col gap-2 text-left">
              <span className="font-sans text-[11px] font-bold tracking-wider text-primary uppercase">
                Myth or Reality?
              </span>
              <h3 className="font-display font-semibold text-foreground text-lg sm:text-xl leading-snug">
                "{currentQuestion.myth}"
              </h3>
            </div>

            {/* True / False */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "True", value: true },
                { label: "False", value: false },
              ].map((opt) => {
                const isChosen = selected === opt.value;
                const isCorrect = opt.value === currentQuestion.answer;

                let styles =
                  "border-border bg-background text-foreground hover:border-primary hover:bg-primary/5";
                if (answered) {
                  if (isCorrect) {
                    styles = "border-success bg-success-muted text-success-muted-foreground";
                  } else if (isChosen) {
                    styles = "border-destructive bg-destructive/10 text-destructive";
                  } else {
                    styles = "border-border opacity-50";
                  }
                }

                return (
                  <button
                    key={opt.label}
                    disabled={answered}
                    onClick={() => handleAnswer(opt.value)}
                    className={`flex items-center justify-center gap-1.5 h-12 rounded-xl border font-sans font-bold text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.98] ${styles}`}
                  >
                    <span>{opt.label}</span>
                    {answered && isCorrect && <Check className="w-4 h-4 shrink-0" />}
                    {answered && isChosen && !isCorrect && <X className="w-4 h-4 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Reveal */}
            {answered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="border-t border-border pt-4 flex flex-col gap-4 text-left overflow-hidden"
              >
                <div className="flex flex-col gap-1.5">
                  <span className="font-sans text-[11px] font-bold tracking-wider text-success uppercase">
                    The Reality
                  </span>
                  <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
                <button
                  onClick={handleNext}
                  className="flex items-center justify-center gap-1.5 self-end h-10 px-5 rounded-full bg-foreground text-background font-sans font-bold text-xs hover:opacity-90 transition-opacity active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
                >
                  <span>{isLastQuestion ? "See Results" : "Next Myth"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* PHASE 3 — RESULTS + CHECKLIST */}
        {phase === "results" && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-background border border-border rounded-2xl p-6 sm:p-8 shadow-soft flex flex-col gap-8 text-center"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-success-muted flex items-center justify-center text-success">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-display font-semibold text-foreground text-xl sm:text-2xl mt-1">
                Myths busted!
              </h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed max-w-sm">
                You got <span className="font-bold text-primary">{score} of {QUIZ_QUESTIONS.length}</span> right.
                Renting isn't about hidden fees — it's about skipping the hidden costs of owning.
              </p>
            </div>

            {/* Hidden-cost checklist */}
            <div className="flex flex-col gap-3 text-left border-t border-border pt-6">
              <h4 className="font-display font-semibold text-foreground text-lg mb-1 text-center">
                The hidden-cost comparison
              </h4>
              {COMPARISON_ITEMS.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-cream border border-border rounded-xl p-4 flex flex-col gap-2"
                >
                  <span className="font-sans text-xs font-bold text-foreground uppercase tracking-wide">
                    {item.feature}
                  </span>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Buying
                      </span>
                      <span className="block text-muted-foreground mt-0.5">{item.buying}</span>
                    </div>
                    <div className="border-l border-border pl-4">
                      <span className="block text-[10px] font-bold text-primary uppercase tracking-wider">
                        RentBasket
                      </span>
                      <span className="block text-foreground font-semibold mt-0.5">{item.renting}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 items-center">
              <Link to="/catalog" className="w-full">
                <button className="btn-primary w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                  Browse Catalogue
                </button>
              </Link>
              <button
                onClick={handleStart}
                className="flex items-center justify-center gap-1.5 h-10 px-6 rounded-full text-muted-foreground font-sans font-bold text-sm hover:text-foreground transition-colors active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MythOrFact = () => {
  const data = [
    {
      belief: "Buying is always cheaper than renting.",
      reality:
        "Renting is more economical for usage up to ~30 months compared to buying - plus you avoid resale hassles and depreciation.",
    },
    {
      belief: "Rental furniture is always old or broken.",
      reality:
        "RentBasket products are either new or in mint condition. Every item goes through sanitization and strict quality checks before delivery.",
    },
    {
      belief: "Rentals have boring designs and limited options.",
      reality:
        "RentBasket offers modern, stylish furniture with multiple designs and color options to match your home.",
    },
    {
      belief: "Rental plans are full of hidden costs and traps.",
      reality:
        "RentBasket believes in transparent pricing with no hidden costs - what you see is what you pay.",
    },
    {
      belief: "Repairs are slow when you rent.",
      reality:
        "RentBasket has a proven track record of fast service, and repairs are handled quickly and at no additional cost.",
    },
    {
      belief: "You must be locked in for long periods.",
      reality:
        "RentBasket offers flexible lock-in options ranging from just 3 months to 12 months, so you can rent for exactly as long as you need.",
    },
  ];

  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8 md:mb-12">
        {/* Responsive Section Header */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold font-display mb-3 md:mb-4 tracking-tight">
          Belief or Reality?
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-xl mx-auto">
          Let's bust the most common myths about renting home furniture and appliances.
        </p>
      </div>
      {/* Desktop (≥ lg): the original flip-card grid, untouched. */}
      <div className="hidden lg:block w-full max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {data.map((item, index) => (
            <Card key={index} belief={item.belief} reality={item.reality} />
          ))}
        </div>
      </div>

      {/* Mobile & tablet (< lg): the interactive quiz. */}
      <div className="lg:hidden">
        <MythQuiz />
      </div>
    </section>
  );
};

export default MythOrFact;
