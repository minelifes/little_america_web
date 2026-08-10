// NOT ported from Dart — shared hover-feedback styles for icon-only
// buttons (cart/account/search/close/back/remove/arrows/etc.) across the
// site. Before this, only MenuItem (app-bar nav links) and NumericStepper's
// +/- buttons had any hover feedback; every other icon trigger was a bare
// `Box component="button"` with no `:hover` state at all. These are meant
// to be spread into a component's own `sx` (which still owns
// width/height/position/etc.), not used standalone.

/** Gray rounded-background hover, for icon buttons on a transparent or
 * light background (header icons, drawer close/back/remove buttons, filter
 * chip remove, etc.). Matches MenuItem's nav-link hover and NumericStepper's
 * existing +/- button hover. */
export const iconHoverSx = {
  transition: "background-color 200ms ease",
  "&:hover": {
    backgroundColor: "rgba(0,0,0,0.06)",
  },
} as const;

/** Same idea, for icon buttons that already sit on a solid white circle
 * (image-gallery lightbox close, home banner prev/next arrows) — a
 * transparent gray overlay wouldn't read against white, so this darkens the
 * white slightly instead. */
export const whiteIconHoverSx = {
  transition: "background-color 200ms ease",
  "&:hover": {
    backgroundColor: "#efefef",
  },
} as const;
