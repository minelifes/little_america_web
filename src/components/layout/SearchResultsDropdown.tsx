import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import NetworkImage from "../common/NetworkImage";
import { useSearchSuggestions } from "../../api/hooks";
import useDebouncedValue from "../../hooks/useDebouncedValue";
import { prepareImageUrl } from "../../api/constants";
import { colors } from "../../theme/theme";
import { ROUTES } from "../../routes";

// Dart's default (pre-interaction) message — shorter than the one shown
// once the user has typed 1-2 characters.
const EMPTY_MESSAGE = "Введіть текст";
const MIN_LENGTH_MESSAGE = "Введіть текст для пошуку,\nмінімальна кількість символів - 3.";
const NOT_FOUND_MESSAGE = "Нічого не знайдено,\nспробуйте змінити запит :(";

interface SearchResultsDropdownProps {
  query: string;
  onNavigate: () => void;
  /** Mobile renders this as a full-height overlay instead of a capped-height card. */
  fullHeight?: boolean;
}

// Ported from lib/resources/widgets/appbar/search_widget.dart. Pure content
// — positioning/width/height are the caller's responsibility (HeaderDesktop
// anchors a fixed-width panel to the right of the pill; HeaderMobile makes
// it a full-width, full-height overlay), since those differ per breakpoint.
export default function SearchResultsDropdown({ query, onNavigate, fullHeight = false }: SearchResultsDropdownProps) {
  const navigate = useNavigate();
  const debounced = useDebouncedValue(query, 300);
  const trimmed = debounced.trim();
  const { data, isFetching } = useSearchSuggestions(debounced);

  return (
    <Box
      sx={{
        height: fullHeight ? "100%" : "auto",
        maxHeight: fullHeight ? "100%" : 480,
        overflowY: "auto",
        backgroundColor: "#ffffff",
        borderBottomLeftRadius: "16px",
        borderBottomRightRadius: "16px",
        boxShadow: "0 12px 32px rgba(0,0,0,0.16)",
      }}
    >
      {trimmed.length === 0 ? (
        <Box sx={{ py: 4, px: 3, textAlign: "center", color: colors.additionalTextColor2 }}>{EMPTY_MESSAGE}</Box>
      ) : trimmed.length < 3 ? (
        <Box sx={{ py: 4, px: 3, textAlign: "center", whiteSpace: "pre-line", color: colors.additionalTextColor2 }}>
          {MIN_LENGTH_MESSAGE}
        </Box>
      ) : isFetching ? (
        <Box sx={{ py: 5, display: "flex", justifyContent: "center" }}>
          <CircularProgress size={24} sx={{ color: colors.mainTextColor }} />
        </Box>
      ) : !data || data.content.length === 0 ? (
        <Box sx={{ py: 4, px: 3, textAlign: "center", whiteSpace: "pre-line", color: colors.additionalTextColor2 }}>
          {NOT_FOUND_MESSAGE}
        </Box>
      ) : (
        data.content.map((item) => (
          <Box
            key={item.id}
            component="button"
            onClick={() => {
              navigate(`${ROUTES.product}${item.id}`);
              onNavigate();
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              gap: "20px",
              px: 3,
              py: 1,
              border: "none",
              background: "none",
              cursor: "pointer",
              textAlign: "left",
              fontFamily: "inherit",
              backgroundColor: "transparent",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" },
            }}
          >
            <Box sx={{ width: 100, height: 100, flexShrink: 0 }}>
              <NetworkImage src={prepareImageUrl(item.image)} alt={item.title} radius={8} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0, py: 1 }}>
              <Box
                sx={{
                  fontSize: 14,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {item.title}
              </Box>
              {item.subTitle && (
                <Box
                  sx={{
                    mt: "4px",
                    fontSize: 11,
                    color: colors.additionalTextColor2,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {item.subTitle}
                </Box>
              )}
              <Box sx={{ mt: "8px", fontSize: 14, fontWeight: 700, color: colors.additionalTextColor }}>
                {item.price} ₴
              </Box>
            </Box>
          </Box>
        ))
      )}
    </Box>
  );
}
