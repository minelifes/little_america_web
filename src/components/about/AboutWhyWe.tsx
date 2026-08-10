import Box from "@mui/material/Box";
import WhyWeRow from "./WhyWeRow";
import heartIcon from "../../assets/about/about_us_heart.svg";
import personIcon from "../../assets/about/about_us_person.svg";
import boxIcon from "../../assets/about/about_us_box.svg";
import calendarIcon from "../../assets/about/about_us_calendar.svg";
import carIcon from "../../assets/about/about_us_car.svg";
import telegramIcon from "../../assets/about/about_us_telegram.svg";

// Ported from the "Чому саме ми?" section in about_page.dart.
export default function AboutWhyWe() {
  return (
    <Box sx={{ px: { xs: 2, md: 4 }, mt: "130px" }}>
      <Box component="h2" sx={{ m: 0, fontSize: 32, fontWeight: 400, textAlign: "center" }}>
        Чому саме ми?
      </Box>

      <Box sx={{ mt: "74px", maxWidth: 1000, mx: "auto" }}>
        <WhyWeRow
          variant="bottom"
          icon={heartIcon}
          text="Вся продукція 100% оригінальна - довіра і здоров'я наших клієнтів у нас завжди на першому місці!"
        />
        <WhyWeRow
          variant="right"
          icon={personIcon}
          text="Досвідчені менеджери дадуть відповідь на всі ваші питання та допоможуть з вибором в будь-який час та в будь-якій зручній для тебе формі."
        />
        <WhyWeRow
          variant="left"
          icon={boxIcon}
          text="Ми маємо великий асортимент товару, який постійно оновлюється і підібраний з урахуванням потреб і уподобань клієнтів."
        />
        <WhyWeRow
          variant="right"
          icon={calendarIcon}
          text="Працюємо без вихідних, офіційно, платимо податки, підтримуємо економіку країни, донатимо на ЗСУ"
        />
        <WhyWeRow variant="left" isLast icon={carIcon} text="Відправляємо замовлення щодня. По Україні та закордоном." />

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2, py: 2, px: 4 }}>
          <Box component="span" sx={{ flex: 1, fontSize: 15, textAlign: "left" }}>
            З нами можна зв'язатись в Instagram, Telegram, Facebook, TikTok та електронною поштою.
          </Box>
          <Box component="img" src={telegramIcon} alt="" sx={{ width: 40, height: 34, objectFit: "contain", flexShrink: 0 }} />
        </Box>
      </Box>
    </Box>
  );
}
