import { useState, useRef } from "react";
import { Check, X, ArrowRight, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

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
  const containerRef = useRef(null);

  // State for the quiz
  const [phase, setPhase] = useState("intro"); // "intro" | "quiz" | "results"
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null); // null | boolean (the tapped answer)
  const [score, setScore] = useState(0);

  // Dismissal states
  const [isDismissed, setIsDismissed] = useState(false);
  const [isCurrentlyFullscreen, setIsCurrentlyFullscreen] = useState(false);

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

  // Scroll tracking on parent runway
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Monitor scroll progress to reset dismiss state and toggle z-index
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const inRange = latest > 0.3 && latest < 0.7;
    setIsCurrentlyFullscreen(inRange);
    
    // Reset when scrolling out of range
    if (latest === 0 || latest === 1) {
      setIsDismissed(false);
    }
  });

  // Card scale transforms
  const cardWidth = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], ["90%", "100%", "100%", "90%"]);
  const cardHeight = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], ["390px", "100vh", "100vh", "390px"]);
  const cardMaxWidth = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], ["448px", "100%", "100%", "448px"]);
  const cardBorderRadius = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], ["24px", "0px", "0px", "24px"]);

  // Padding transforms
  const pTop = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], ["24px", "56px", "56px", "24px"]);
  const pBottom = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], ["24px", "48px", "48px", "24px"]);
  const pLeftRight = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], ["24px", "32px", "32px", "24px"]);

  // Scaling transitions for layout
  const mythFontSize = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], ["18px", "28px", "28px", "18px"]);
  const contentGap = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], ["16px", "32px", "32px", "16px"]);

  // Card outline / shadow fades
  const borderWidth = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], ["1px", "0px", "0px", "1px"]);
  const cardShadow = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [
    "0px 4px 20px -4px rgba(0, 0, 0, 0.1)",
    "0px 0px 0px 0px rgba(0, 0, 0, 0)",
    "0px 0px 0px 0px rgba(0, 0, 0, 0)",
    "0px 4px 20px -4px rgba(0, 0, 0, 0.1)"
  ]);

  // Dimension overrides if dismissed by user
  const finalWidth = isDismissed ? "90%" : cardWidth;
  const finalHeight = isDismissed ? "390px" : cardHeight;
  const finalMaxWidth = isDismissed ? "448px" : cardMaxWidth;
  const finalBorderRadius = isDismissed ? "24px" : cardBorderRadius;
  const finalPTop = isDismissed ? "24px" : pTop;
  const finalPBottom = isDismissed ? "24px" : pBottom;
  const finalPLeftRight = isDismissed ? "24px" : pLeftRight;
  const finalBorderWidth = isDismissed ? "1px" : borderWidth;
  const finalCardShadow = isDismissed ? "0px 4px 20px -4px rgba(0, 0, 0, 0.1)" : cardShadow;

  return (
    <div ref={containerRef} className="lg:hidden relative w-full h-[300vh] bg-background border-b border-border/20">
      {/* Title that scrolls out of view naturally */}
      <div className="absolute top-12 left-0 right-0 text-center px-4 pointer-events-none">
        <h2 className="text-3xl sm:text-4xl font-semibold font-display tracking-tight text-foreground">
          Belief or Reality?
        </h2>
      </div>

      <div className={`sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center pointer-events-none ${
        isCurrentlyFullscreen && !isDismissed ? "z-[100]" : "z-10"
      }`}>
        {/* Morphing Card Wrapper */}
        <motion.div
          className="border border-border bg-background flex flex-col justify-between overflow-hidden pointer-events-auto relative"
          style={{
            width: finalWidth,
            height: finalHeight,
            maxWidth: finalMaxWidth,
            borderRadius: finalBorderRadius,
            paddingTop: finalPTop,
            paddingBottom: finalPBottom,
            paddingLeft: finalPLeftRight,
            paddingRight: finalPLeftRight,
            borderWidth: finalBorderWidth,
            boxShadow: finalCardShadow,
          }}
        >
          {/* Top-Right Close Button */}
          {isCurrentlyFullscreen && !isDismissed && (
            <button
              onClick={() => setIsDismissed(true)}
              className="absolute top-4 right-4 p-2 rounded-full bg-muted/40 hover:bg-muted text-foreground transition-all duration-200 active:scale-95 z-[110] pointer-events-auto"
              aria-label="Close quiz"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <AnimatePresence mode="wait">
            {phase === "intro" && (
              <motion.div
                key="intro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col justify-between h-full w-full"
              >
                {/* Header Area */}
                <div className="flex flex-col items-center text-center">
                  <span className="font-sans text-[11px] font-bold tracking-[0.2em] text-primary uppercase">
                    Belief or Reality?
                  </span>
                </div>

                {/* Middle Content Area */}
                <motion.div
                  className="flex flex-col items-center text-center justify-center flex-1"
                  style={{ gap: contentGap }}
                >
                  <motion.h3
                    className="font-sans font-bold text-foreground tracking-tight leading-snug"
                    style={{ fontSize: mythFontSize }}
                  >
                    Is renting actually a waste of money?
                  </motion.h3>
                  <p className="font-sans text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
                    Take our 30-second cost quiz to see if buying upfront is cheaper than renting furniture &amp; appliances.
                  </p>
                </motion.div>

                {/* Bottom Action Area */}
                <div className="flex justify-center w-full pt-4">
                  <button
                    onClick={handleStart}
                    className="btn-primary w-full max-w-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    Start Quiz
                  </button>
                </div>
              </motion.div>
            )}

            {phase === "quiz" && (
              <motion.div
                key={`q-${qIndex}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex flex-col justify-between h-full w-full"
              >
                {/* Header Area */}
                <div className="flex flex-col gap-2 w-full">
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

                {/* Middle Content Area */}
                <motion.div
                  className="flex flex-col text-left justify-center flex-1 min-h-0 overflow-y-auto py-2"
                  style={{ gap: contentGap }}
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-sans text-[11px] font-bold tracking-wider text-primary uppercase">
                      Myth or Reality?
                    </span>
                    <motion.h3
                      className="font-display font-semibold text-foreground leading-snug"
                      style={{ fontSize: mythFontSize }}
                    >
                      "{currentQuestion.myth}"
                    </motion.h3>
                  </div>

                  {/* True / False Option Selection */}
                  <div className="grid grid-cols-2 gap-3 w-full">
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

                  {/* Answer Feedback Panel */}
                  {answered && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="border-t border-border pt-4 flex flex-col gap-1.5 text-left overflow-hidden shrink-0"
                    >
                      <span className="font-sans text-[11px] font-bold tracking-wider text-success uppercase">
                        The Reality
                      </span>
                      <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                        {currentQuestion.explanation}
                      </p>
                    </motion.div>
                  )}
                </motion.div>

                {/* Bottom Action Area */}
                <div className="flex justify-end w-full pt-4 h-14">
                  {answered && (
                    <button
                      onClick={handleNext}
                      className="flex items-center justify-center gap-1.5 h-10 px-5 rounded-full bg-foreground text-background font-sans font-bold text-xs hover:opacity-90 transition-opacity active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 w-full sm:w-auto"
                    >
                      <span>{isLastQuestion ? "See Results" : "Next Myth"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
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
                className="flex flex-col justify-between h-full w-full"
              >
                {/* Header Area */}
                <div className="flex flex-col items-center text-center w-full">
                  <h3 className="font-display font-semibold text-foreground text-xl sm:text-2xl mt-1">
                    Myths busted!
                  </h3>
                  <p className="font-sans text-xs text-muted-foreground leading-relaxed max-w-sm">
                    You got <span className="font-bold text-primary">{score} of {QUIZ_QUESTIONS.length}</span> right.
                    Now here's how the numbers stack up.
                  </p>
                </div>

                {/* Middle Content Area */}
                <div className="flex-1 flex flex-col justify-center my-4 overflow-y-auto min-h-0 py-2">
                  <div className="border border-border rounded-xl bg-muted/5 overflow-hidden font-sans text-xs w-full max-w-md mx-auto">
                    <div className="grid grid-cols-[1.1fr_1fr_1fr] gap-2 px-3 py-2 bg-muted/20 border-b border-border text-[9px] uppercase tracking-wider font-bold text-muted-foreground">
                      <span>Cost Item</span>
                      <span>Buying</span>
                      <span className="text-primary font-extrabold">RentBasket</span>
                    </div>

                    <div className="divide-y divide-border/40">
                      {COMPARISON_ITEMS.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-[1.1fr_1fr_1fr] gap-2 px-3 py-2.5">
                          <span className="font-medium text-foreground">{item.feature}</span>
                          <span className="text-muted-foreground">{item.buying}</span>
                          <span className="text-foreground font-semibold">{item.renting}</span>
                        </div>
                      ))}

                      <div className="grid grid-cols-[1.1fr_1fr_1fr] gap-2 px-3 py-3 bg-primary/5 border-t border-border">
                        <span className="font-bold text-foreground">Total</span>
                        <span className="font-bold text-muted-foreground">{COMPARISON_TOTALS.buying}</span>
                        <span className="font-display font-bold text-primary text-sm leading-none">
                          {COMPARISON_TOTALS.renting}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="font-sans text-[11px] text-muted-foreground text-center leading-relaxed mt-3 max-w-md mx-auto">
                    That's <span className="font-bold text-foreground">{COMPARISON_TOTALS.breakEven}</span> of renting before buying even breaks even, with no hassle of selling or relocation charges.
                  </p>
                </div>

                {/* Bottom Action Area */}
                <div className="flex flex-col gap-2 items-center w-full pt-2">
                  <Link to="/catalog" className="w-full max-w-xs">
                    <button className="btn-primary w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                      Browse Catalogue
                    </button>
                  </Link>
                  <button
                    onClick={handleStart}
                    className="flex items-center justify-center gap-1.5 h-8 px-6 rounded-full text-muted-foreground font-sans font-bold text-xs hover:text-foreground transition-colors active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Try Again</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
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
        "RentBasket offers modern, stylish furniture with multiple designs and color options, plus customization available to match your home.",
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
    <>
      {/* ── Desktop (≥ lg): 2-column editorial split ── */}
      <section className="hidden lg:block py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-background border-b border-border/20">
        <div className="grid grid-cols-[1fr_2fr] gap-16 max-w-7xl mx-auto">
          {/* Left column: sticky title + CTA */}
          <div className="flex flex-col items-start text-left gap-6 lg:sticky lg:top-28 h-fit max-w-sm">
            <div className="flex flex-col gap-3">
              <span className="font-sans text-[11px] font-bold tracking-[0.2em] text-primary uppercase">
                Belief or Reality?
              </span>
              <h2 className="font-display text-4xl xl:text-5xl font-semibold text-foreground tracking-tight leading-[1.15]">
                Let's address the doubts.
              </h2>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed mt-2">
                Renting home furniture and appliances comes with common myths. Here is the math and the reality behind how we make relocation effortless.
              </p>
            </div>
            <Link to="/catalog">
              <button className="btn-primary px-8 h-12 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                Browse Catalogue
              </button>
            </Link>
          </div>

          {/* Right column: comparative rows */}
          <div className="flex flex-col gap-6">
            {data.map((item, index) => (
              <div
                key={index}
                className="flex flex-row gap-8 bg-cream/35 border border-border/40 rounded-2xl p-6 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* Belief */}
                <div className="flex-1 flex flex-col gap-2">
                  <span className="font-sans text-[9px] font-bold text-destructive/80 uppercase tracking-widest leading-none">
                    Belief
                  </span>
                  <p className="font-sans text-sm xl:text-base text-muted-foreground/70 font-medium line-through decoration-destructive/20 decoration-1">
                    "{item.belief}"
                  </p>
                </div>

                {/* Divider */}
                <div className="w-[1px] bg-border/40 shrink-0 self-stretch" />

                {/* Reality */}
                <div className="flex-1 flex flex-col gap-2">
                  <span className="font-sans text-[9px] font-bold text-success uppercase tracking-widest leading-none flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 stroke-[3.5] text-success" />
                    Reality
                  </span>
                  <p className="font-sans text-sm xl:text-[15px] text-foreground font-semibold leading-relaxed">
                    {item.reality}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mobile & tablet (< lg): interactive quiz with scroll-driven expansion ── */}
      <MobileQuizSection />
    </>
  );
};

export default MythOrFact;
