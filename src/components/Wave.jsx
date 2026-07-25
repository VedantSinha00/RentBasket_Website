/**
 * The Wave — one SVG curve divider (§4), used exactly twice on the homepage:
 * hero → carousel band, and testimonials → FAQ band. `color` picks the fill
 * via a token class (e.g. "text-jade", "text-cream") since the path uses
 * currentColor.
 */
const Wave = ({ color = "text-cream", flip = false, className = "" }) => (
  <div
    aria-hidden="true"
    className={`w-full overflow-hidden leading-[0] ${flip ? "rotate-180" : ""} ${className}`}
  >
    <svg
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      className={`block w-full h-10 md:h-14 ${color}`}
    >
      <path
        fill="currentColor"
        d="M0,32 C240,64 480,0 720,16 C960,32 1200,64 1440,24 L1440,60 L0,60 Z"
      />
    </svg>
  </div>
);

export default Wave;
