import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import HamburgerMenu from "./HamburgerMenu";
import SearchField from "./SearchField";
import SearchResultsDropdown from "./SearchResultsDropdown";
import CartButton from "./CartButton";
import AccountButton from "./AccountButton";
import { centerBumpPillPath } from "./headerShapes";
import { ROUTES } from "../../routes";
import useElementWidth from "../../hooks/useElementWidth";
import logo from "../../assets/logo.webp";

// Same fused pill+badge silhouette as HeaderDesktop, but the badge sits in
// the middle of the bar (over the hamburger/icons row) instead of at an end.
const SIDE_INSET = 12;
const BAR_TOP = 16;
const BAR_HEIGHT = 64;
const BAR_RADIUS = BAR_HEIGHT / 2;
const CIRCLE_SIZE = 88;
const CIRCLE_TOP = BAR_TOP + BAR_RADIUS - CIRCLE_SIZE / 2;
const CONTAINER_HEIGHT = Math.max(CIRCLE_TOP + CIRCLE_SIZE, BAR_TOP + BAR_HEIGHT) + 8;

// Ported from lib/resources/widgets/appbar/app_bar_mobile.dart, adapted to
// match the target design's floating circular logo badge centered in the bar.
export default function HeaderMobile() {
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const [containerRef, containerWidth] = useElementWidth<HTMLDivElement>();

  const closeSearch = () => {
    setSearchVisible(false);
    setSearchValue("");
  };

  // Close the search dropdown on outside click — matches standard dropdown
  // UX; the Dart source doesn't need this (no dropdown existed there before).
  useEffect(() => {
    if (!isSearchVisible) return;
    const onPointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeSearch();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isSearchVisible, containerRef]);

  const shapePath = centerBumpPillPath({
    width: containerWidth,
    sideInset: SIDE_INSET,
    barTop: BAR_TOP,
    barHeight: BAR_HEIGHT,
    circleSize: CIRCLE_SIZE,
    squareRightEnd: isSearchVisible,
  });

  // On narrow phones there isn't room for the hamburger + the fully open
  // 200px search input + the cart icon all at once — free up space the
  // same way the original mobile app bar does.
  const hideHamburger = isSearchVisible && containerWidth < 400;

  return (
    <Box ref={containerRef} sx={{ position: "relative", width: "100%", height: CONTAINER_HEIGHT }}>
      <Box
        component="svg"
        width={containerWidth}
        height={CONTAINER_HEIGHT}
        viewBox={`0 0 ${containerWidth} ${CONTAINER_HEIGHT}`}
        sx={{ position: "absolute", inset: 0, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.14))" }}
      >
        <path d={shapePath} fill="#ffffff" />
      </Box>

      <Box
        sx={{
          position: "absolute",
          left: SIDE_INSET,
          right: SIDE_INSET,
          top: BAR_TOP,
          height: BAR_HEIGHT,
          display: "flex",
          alignItems: "center",
          pl: "12px",
          pr: "8px",
        }}
      >
        <Box
          sx={{
            width: hideHamburger ? 0 : 40,
            overflow: "hidden",
            transition: "width 200ms ease-in-out",
          }}
        >
          <HamburgerMenu />
        </Box>
        <Box sx={{ flex: 1 }} />
        <SearchField
          isSearchVisible={isSearchVisible}
          value={searchValue}
          onChange={setSearchValue}
          onToggle={() => (isSearchVisible ? closeSearch() : setSearchVisible(true))}
        />
        <AccountButton />
        <CartButton />
      </Box>

      {isSearchVisible && (
        <Box
          sx={{
            position: "fixed",
            top: BAR_TOP + BAR_HEIGHT,
            left: 0,
            right: 0,
            height: `calc(100vh - ${BAR_TOP + BAR_HEIGHT}px)`,
            zIndex: 1300,
          }}
        >
          <SearchResultsDropdown query={searchValue} onNavigate={closeSearch} fullHeight />
        </Box>
      )}

      {/* Hidden while the search input is open — it sits in the horizontal
          center of the bar, right where the expanded input renders, and
          would otherwise be drawn on top of it (unreadable/unclickable). */}
      <Box
        onClick={() => navigate(ROUTES.home)}
        sx={{
          position: "absolute",
          left: "50%",
          top: CIRCLE_TOP,
          transform: isSearchVisible ? "translateX(-50%) scale(0.6)" : "translateX(-50%) scale(1)",
          opacity: isSearchVisible ? 0 : 1,
          pointerEvents: isSearchVisible ? "none" : "auto",
          transition: "opacity 200ms ease-in-out, transform 200ms ease-in-out",
          width: CIRCLE_SIZE,
          height: CIRCLE_SIZE,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <Box component="img" src={logo} alt="Little America" sx={{ width: CIRCLE_SIZE - 16, height: CIRCLE_SIZE - 16 }} />
      </Box>
    </Box>
  );
}
