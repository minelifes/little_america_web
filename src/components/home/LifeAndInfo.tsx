import Box from "@mui/material/Box";
import ToProductButton from "../common/ToProductButton";
import { backgroundGradient } from "../../theme/gradients";
import { ROUTES } from "../../routes";
import useWindowWidth from "../../hooks/useWindowWidth";
import mainImg1 from "../../assets/main_img_1.webp";
import mainImg2 from "../../assets/main_img_2.webp";

function TextBlock({
  title,
  text,
  to,
}: {
  title: string;
  text: string;
  to?: string;
}) {
  return (
    <Box
      sx={{
        background: backgroundGradient,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 4,
        py: 6,
        height: "100%",
      }}
    >
      <Box sx={{ fontSize: 30, fontWeight: 300 }}>{title}</Box>
      <Box sx={{ mt: 4, fontSize: 16, fontWeight: 400, maxWidth: 520 }}>{text}</Box>
      {to && (
        <Box sx={{ mt: "22px" }}>
          <ToProductButton text="БІЛЬШЕ" to={to} />
        </Box>
      )}
    </Box>
  );
}

function ImageBlock({ src }: { src: string }) {
  return (
    <Box
      component="img"
      src={src}
      alt=""
      sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
    />
  );
}

// Ported from lib/resources/widgets/life_and_info.dart
export default function LifeAndInfo() {
  const width = useWindowWidth();
  const isSmallScreen = width < 550;

  const text1 = (
    <TextBlock
      title="Життя магазину та інша інформація"
      text="Ми часто проводимо акції, даруємо подарунки на свята, знижки. Відкриті до побажань та пропозицій. Постійно оновлюємо асортимент, додаємо бажані товари. Стараємося вдосконалюватися для наших клієнтів."
      to={ROUTES.aboutUs}
    />
  );
  const text2 = <TextBlock title="Брендові речі" text="Любиш бренди? Victoria's Secret, Bath&Body Works, Starbucks та інші на полицях нашого магазину." />;
  const img1 = <ImageBlock src={mainImg1} />;
  const img2 = <ImageBlock src={mainImg2} />;

  const cells = isSmallScreen ? [img1, text1, img2, text2] : [text1, img1, img2, text2];
  const cellHeight = isSmallScreen ? 420 : 400;

  return (
    <Box sx={{ pt: 4, px: 1 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: isSmallScreen ? "1fr" : "1fr 1fr",
          gap: 0,
        }}
      >
        {cells.map((cell, i) => (
          <Box key={i} sx={{ height: cellHeight, overflow: "hidden" }}>
            {cell}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
