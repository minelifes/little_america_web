import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { useNavigate } from "react-router-dom";
import { useNews } from "../../api/hooks";
import SliderItem from "./SliderItem";

const AUTO_ADVANCE_MS = 5000;
const SLIDE_DURATION_MS = 500;

type Direction = 1 | -1;
interface TransitionState {
  toIndex: number;
  direction: Direction;
}

// Ported from lib/resources/widgets/slider/slider.dart (CarouselSlider) —
// Flutter's CarouselSlider animates a horizontal slide between items by
// default; the previous port swapped the current item instantly instead.
// This restores that sliding behavior manually (no carousel library
// dependency): a 200%-wide two-slide track (current + incoming) translates
// into view, then settles back to a single static slide once the CSS
// transition ends.
export default function Slider() {
  const { data: news, isLoading, isError } = useNews();
  const [index, setIndex] = useState(0);
  const [transition, setTransition] = useState<TransitionState | null>(null);
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  const count = news?.length ?? 0;

  // Refs so the auto-advance interval (created once per `count`) always
  // reads the latest index/transition without needing to be recreated.
  const indexRef = useRef(index);
  const transitionRef = useRef(transition);
  indexRef.current = index;
  transitionRef.current = transition;

  const goTo = (toIndex: number, direction: Direction) => {
    if (transitionRef.current || toIndex === indexRef.current) return;
    setTransition({ toIndex, direction });
    // Two rAFs: let the browser paint the starting (pre-animate) transform
    // first, then flip `animate` so the transition actually runs instead of
    // being coalesced with the initial style.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimate(true));
    });
  };

  const next = () => goTo((indexRef.current + 1) % count, 1);
  const prev = () => goTo((indexRef.current - 1 + count) % count, -1);

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || e.propertyName !== "transform" || !transition) return;
    setIndex(transition.toIndex);
    setTransition(null);
    setAnimate(false);
  };

  useEffect(() => {
    if (count < 2) return;
    const id = setInterval(() => {
      if (transitionRef.current) return;
      next();
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  if (isLoading) {
    return <Skeleton variant="rectangular" width="100%" height={700} />;
  }
  if (isError) {
    return (
      <Box
        sx={{
          width: "100%",
          height: 700,
          backgroundColor: "#F4F5F8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "text.secondary",
          fontSize: 14,
        }}
      >
        Не вдалося завантажити банер
      </Box>
    );
  }
  if (!news || news.length === 0) {
    return null;
  }

  const current = news[index % news.length];
  const renderSlide = (item: (typeof news)[number]) => (
    <SliderItem item={item} onPrev={prev} onNext={next} onNavigate={(link) => navigate(link)} />
  );

  return (
    <Box sx={{ width: "100%", height: 700, overflow: "hidden" }}>
      {transition ? (
        <Box
          onTransitionEnd={handleTransitionEnd}
          sx={{
            display: "flex",
            width: "200%",
            height: "100%",
            transform: animate
              ? transition.direction === 1
                ? "translateX(-50%)"
                : "translateX(0%)"
              : transition.direction === 1
                ? "translateX(0%)"
                : "translateX(-50%)",
            transition: animate ? `transform ${SLIDE_DURATION_MS}ms ease` : "none",
          }}
        >
          <Box sx={{ width: "50%", height: "100%", flexShrink: 0 }}>
            {renderSlide(transition.direction === 1 ? current : news[transition.toIndex])}
          </Box>
          <Box sx={{ width: "50%", height: "100%", flexShrink: 0 }}>
            {renderSlide(transition.direction === 1 ? news[transition.toIndex] : current)}
          </Box>
        </Box>
      ) : (
        renderSlide(current)
      )}
    </Box>
  );
}
