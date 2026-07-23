import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Play } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

// Controlled by the parent row: `active` says this card is the one playing
// with sound, `dimmed` says a sibling is active instead. Local state only
// covers what's intrinsic to this card (in-viewport, reduced-motion pref).
const VideoTestimonial = ({ name, city, webmSrc, mp4Src, poster, active, dimmed, onToggle }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Single effect drives all playback state from the props/state above:
  // active -> unmuted single play; dimmed or out-of-view -> paused;
  // otherwise (ambient, in view) -> muted loop. Reduced motion never autoplays.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (active) {
      video.muted = false;
      video.loop = false;
      video.play().catch(() => {});
      return;
    }

    video.muted = true;
    video.loop = true;
    if (reducedMotion || dimmed || !inView) {
      video.pause();
    } else {
      video.play().catch(() => {});
    }
  }, [active, dimmed, inView, reducedMotion]);

  // Re-arm the ambient loop's start position whenever we drop out of active.
  useEffect(() => {
    if (!active && videoRef.current) videoRef.current.currentTime = 0;
  }, [active]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onEnded = () => {
      if (active) trackEvent("testimonial_complete", { name });
    };
    video.addEventListener("ended", onEnded);
    return () => video.removeEventListener("ended", onEnded);
  }, [active, name]);

  const handleClick = () => {
    if (!active) trackEvent("testimonial_play", { name });
    onToggle();
  };

  const caption = city ? `${name} · ${city}` : name;
  const ariaLabel = active
    ? `Mute testimonial from ${name}`
    : `Play testimonial from ${name}, with sound`;

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-2 shrink-0">
      <button
        type="button"
        onClick={handleClick}
        aria-label={ariaLabel}
        className={`relative w-full aspect-[9/16] rounded-3xl overflow-hidden border border-border bg-card shadow-soft transition-opacity duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
          dimmed ? "opacity-50" : "opacity-100"
        }`}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          poster={poster}
          preload="none"
          playsInline
          muted
          loop
          aria-hidden="true"
        >
          {!reducedMotion && webmSrc && <source src={webmSrc} type="video/webm" />}
          {!reducedMotion && mp4Src && <source src={mp4Src} type="video/mp4" />}
        </video>

        {reducedMotion && !active && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <span className="flex items-center justify-center w-14 h-14 rounded-full bg-white/90 text-foreground shadow-soft">
              <Play size={22} fill="currentColor" className="ml-0.5" />
            </span>
          </div>
        )}

        <span className="absolute bottom-3 right-3 flex items-center justify-center w-8 h-8 rounded-full bg-black/50 text-white">
          {active ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </span>
      </button>

      <div className="text-center">
        <p className="text-sm font-bold text-foreground leading-tight">{caption}</p>
      </div>
    </div>
  );
};

export default VideoTestimonial;
