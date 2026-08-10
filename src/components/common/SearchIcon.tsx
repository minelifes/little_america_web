interface SearchIconProps {
  color?: string;
  size?: number;
}

// Ported 1:1 from assets/images/search.svg
export default function SearchIcon({ color = "#161616", size = 20 }: SearchIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M19.0004 18.9999L14.6504 14.6499" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
