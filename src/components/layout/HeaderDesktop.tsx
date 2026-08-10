import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import MenuItem from "./MenuItem";
import SearchField from "./SearchField";
import SearchResultsDropdown from "./SearchResultsDropdown";
import CartButton from "./CartButton";
import AccountButton from "./AccountButton";
import { leftBumpPillPath } from "./headerShapes";
import { ROUTES } from "../../routes";
import { colors } from "../../theme/theme";
import useElementWidth from "../../hooks/useElementWidth";
import logo from "../../assets/logo.webp";

// Bar + circular logo badge geometry, matching the reference screenshot:
// a pill-shaped nav bar with a larger circular badge fused into its left
// end, the logo centered inside that badge — rendered as one custom SVG
// silhouette (not two overlapping boxes) so there's a single clean shadow.
const SIDE_INSET = 24;
const BAR_TOP = 24;
const BAR_HEIGHT = 72;
const BAR_RADIUS = BAR_HEIGHT / 2;
const CIRCLE_SIZE = 104;
const CAP_CENTER_X = SIDE_INSET + BAR_RADIUS;
const CAP_CENTER_Y = BAR_TOP + BAR_RADIUS;
const CIRCLE_LEFT = CAP_CENTER_X - CIRCLE_SIZE / 2;
const CIRCLE_TOP = CAP_CENTER_Y - CIRCLE_SIZE / 2;
const CONTAINER_HEIGHT = Math.max(CIRCLE_TOP + CIRCLE_SIZE, BAR_TOP + BAR_HEIGHT) + 8;
const BAR_TEXT_PADDING_LEFT = CIRCLE_LEFT + CIRCLE_SIZE + 14 - SIDE_INSET;

// Ported from lib/resources/widgets/appbar/app_bar.dart (desktop branch),
// adapted to match the target design's floating circular logo badge +
// wordmark, centered nav, and search/cart on the right.
export default function HeaderDesktop() {
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

  const shapePath = leftBumpPillPath({
    width: containerWidth,
    sideInset: SIDE_INSET,
    barTop: BAR_TOP,
    barHeight: BAR_HEIGHT,
    circleSize: CIRCLE_SIZE,
    squareRightEnd: isSearchVisible,
  });

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
          pl: `${BAR_TEXT_PADDING_LEFT}px`,
          pr: "32px",
        }}
      >
        <Box
          sx={{ lineHeight: 1.2, fontSize: 20, color: colors.mainTextColor, cursor: "pointer", flexShrink: 0 }}
          onClick={() => navigate(ROUTES.home)}
        >
          <div>Little</div>
          <div>America</div>
        </Box>

        <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
          {!isSearchVisible && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <MenuItem text="Головна" route={ROUTES.home} />
              <MenuItem text="Товари" route={ROUTES.products} />
              <MenuItem text="Про нас" route={ROUTES.aboutUs} />
              <MenuItem text="Контакти" route={ROUTES.contacts} />
            </Box>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          <SearchField
            isSearchVisible={isSearchVisible}
            value={searchValue}
            onChange={setSearchValue}
            onToggle={() => (isSearchVisible ? closeSearch() : setSearchVisible(true))}
          />
          <AccountButton />
          <CartButton />
        </Box>
      </Box>

      {isSearchVisible && (
        <Box
          sx={{
            position: "absolute",
            top: BAR_TOP + BAR_HEIGHT,
            right: SIDE_INSET,
            width: 480,
            maxWidth: `calc(100% - ${SIDE_INSET * 2}px)`,
            zIndex: 1300,
          }}
        >
          <SearchResultsDropdown query={searchValue} onNavigate={closeSearch} />
        </Box>
      )}

      <Box
        onClick={() => navigate(ROUTES.home)}
        sx={{
          position: "absolute",
          left: CIRCLE_LEFT,
          top: CIRCLE_TOP,
          width: CIRCLE_SIZE,
          height: CIRCLE_SIZE,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <Box component="img" src={logo} alt="Little America" sx={{ width: CIRCLE_SIZE - 12, height: CIRCLE_SIZE - 12 }} />
      </Box>
    </Box>
  );
}
