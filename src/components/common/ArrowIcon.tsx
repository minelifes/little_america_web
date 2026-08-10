interface ArrowIconProps {
  color?: string;
  width?: number;
  rotate?: boolean;
}

// Ported 1:1 from assets/images/arrow.svg (65x16 viewBox)
export default function ArrowIcon({ color = "#161616", width = 24, rotate = false }: ArrowIconProps) {
  return (
    <svg
      width={width}
      height={(width * 16) / 65}
      viewBox="0 0 65 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: rotate ? "rotate(180deg)" : undefined, flexShrink: 0, display: "block" }}
    >
      <path d="M1 7.69565H64M64 7.69565L61 1M64 7.69565L61 15" stroke={color} strokeLinecap="round" />
    </svg>
  );
}
