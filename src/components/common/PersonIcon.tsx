interface PersonIconProps {
  color?: string;
  size?: number;
}

// NOT ported from Dart (no account icon exists there) — drawn to match
// CartIcon's style (filled glyph inside a thin outlined circle) so the new
// account button sits naturally next to the cart icon in the header.
export default function PersonIcon({ color = "#161616", size = 34 }: PersonIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17 17.5C19.7614 17.5 22 15.2614 22 12.5C22 9.73858 19.7614 7.5 17 7.5C14.2386 7.5 12 9.73858 12 12.5C12 15.2614 14.2386 17.5 17 17.5Z"
        stroke={color}
      />
      <path
        d="M9.5 26.5C9.5 22.634 12.9101 19.5 17 19.5C21.0899 19.5 24.5 22.634 24.5 26.5"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M23 2.16303C21.1471 1.41301 19.1218 1 17 1C8.16344 1 1 8.16344 1 17C1 25.8366 8.16344 33 17 33C25.8366 33 33 25.8366 33 17C33 13.8769 32.1052 10.9627 30.5579 8.5"
        stroke={color}
        strokeLinecap="round"
      />
    </svg>
  );
}
