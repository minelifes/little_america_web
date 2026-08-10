import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "../common/SearchIcon";
import CloseIcon from "../common/CloseIcon";
import { iconHoverSx } from "../../theme/interactions";

interface SearchFieldProps {
  isSearchVisible: boolean;
  value: string;
  onChange: (value: string) => void;
  onToggle: () => void;
}

// Ported from lib/resources/widgets/appbar/search_field.dart
export default function SearchField({ isSearchVisible, value, onChange, onToggle }: SearchFieldProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box
        sx={{
          width: isSearchVisible ? 200 : 0,
          overflow: "hidden",
          transition: "width 200ms ease-in-out",
        }}
      >
        {isSearchVisible && (
          <InputBase
            autoFocus
            placeholder="Пошук"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            sx={{
              width: "100%",
              fontSize: 14,
              borderBottom: "1px solid #161616",
            }}
          />
        )}
      </Box>
      <Box
        component="button"
        onClick={onToggle}
        aria-label="search"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "none",
          border: "none",
          cursor: "pointer",
          ...iconHoverSx,
        }}
      >
        {isSearchVisible ? <CloseIcon /> : <SearchIcon />}
      </Box>
    </Box>
  );
}
