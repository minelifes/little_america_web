interface MenuIconProps {
  color?: string;
  size?: number;
}

// Ported 1:1 from assets/images/menu.svg
export default function MenuIcon({ color = "#161616", size = 21 }: MenuIconProps) {
  return (
    <svg width={size} height={(size * 16) / 21} viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 8H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1 1.6665H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1 14.333H20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
