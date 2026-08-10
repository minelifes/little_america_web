import Box from "@mui/material/Box";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ContactInfoColumn from "../components/contacts/ContactInfoColumn";
import { backgroundGradient } from "../theme/gradients";
import { colors } from "../theme/theme";
import locationIcon from "../assets/contacts/location.svg";
import calendarIcon from "../assets/contacts/about_us_calendar.svg";
import phoneIcon from "../assets/contacts/phone.svg";
import instaIcon from "../assets/contacts/insta2.svg";
import { useSeo } from "../seo/useSeo";
import { useJsonLd, localBusinessJsonLd } from "../seo/structuredData";

// Store location — ported 1:1 from lib/resources/widgets/google_map.dart
// (LatLng(50.743356280514526, 25.31798788221867), zoom 16). The Maps API key
// is the one already embedded (and therefore already public) in the
// compiled Flutter web build's web/index.html — same situation as the
// client secret used for the auth token.
const MAP_LAT = 50.743356280514526;
const MAP_LNG = 25.31798788221867;
const MAPS_API_KEY = "AIzaSyARb20eAx7B6UiunYPApAOYAYX-0O8HNS4";
const MAP_SRC = `https://www.google.com/maps/embed/v1/place?key=${MAPS_API_KEY}&q=${MAP_LAT},${MAP_LNG}&zoom=16`;

const dimText = {
  color: colors.additionalTextColor,
  fontSize: 18,
  fontWeight: 400,
} as const;

function ScheduleLine({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Box component="span" sx={{ color: colors.additionalTextColor }}>
        {label}{" "}
      </Box>
      <Box component="span" sx={{ color: colors.mainTextColor }}>
        {value}
      </Box>
    </Box>
  );
}

// Ported from lib/resources/pages/contacts_page.dart. Like HomePage/AboutUsPage,
// the fixed Header floats over the map (no top spacer).
export default function ContactsPage() {
  useSeo({
    title: "Контакти",
    description:
      "Little America у Луцьку: вул. Богдана Хмельницького 40а/1. Графік: будні 10:00–20:00, вихідні 10:00–18:00. Зв'яжіться з нами через Viber, Telegram чи Instagram.",
  });
  useJsonLd("local-business-jsonld", localBusinessJsonLd());

  return (
    <Box sx={{ width: "100%", overflowX: "hidden" }}>
      <Header />

      <Box component="main">
        <Box
          component="iframe"
          title="Little America — карта"
          src={MAP_SRC}
          loading="lazy"
          allowFullScreen
          sx={{ display: "block", width: "100%", height: 700, border: 0 }}
        />

        <Box sx={{ background: backgroundGradient, px: 2 }}>
          <Box
            component="h2"
            sx={{
              m: 0,
              pt: "24px",
              pb: "96px",
              fontSize: 24,
              fontWeight: 300,
              textAlign: "center",
            }}
          >
            Для швидкого зв'язку з нами
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "32px",
              pb: "72px",
            }}
          >
            <ContactInfoColumn icon={locationIcon} title="АДРЕСА">
              <Box sx={{ ...dimText, whiteSpace: "pre-line" }}>
                {"м. Луцьк\nв. Богдана Хмельницького 40а/1"}
              </Box>
            </ContactInfoColumn>

            <ContactInfoColumn icon={calendarIcon} title="ГРАФІК">
              <ScheduleLine label="Будні:" value="10:00 - 20:00" />
              <Box sx={{ height: "16px" }} />
              <ScheduleLine label="Вихідні:" value="10:00 - 18:00" />
            </ContactInfoColumn>

            <ContactInfoColumn icon={phoneIcon} title="МОБІЛЬНИЙ">
              <Box sx={{ fontSize: 15 }}>Viber, Telegram</Box>
              <Box sx={{ mt: 1, ...dimText }}>+38093 706 2276</Box>
              <Box sx={{ mt: 3, fontSize: 15 }}>
                З приводу співпраці (Viber, Telegram):
              </Box>
              <Box sx={{ mt: 1, ...dimText }}>+38066 409 4751</Box>
            </ContactInfoColumn>

            <ContactInfoColumn icon={instaIcon} title="INSTAGRAM">
              <Box sx={dimText}>@little_america_</Box>
              <Box sx={{ mt: 1, ...dimText }}>@makeup_queen_ua</Box>
            </ContactInfoColumn>
          </Box>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}
