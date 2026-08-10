import Box from "@mui/material/Box";
import icon1Light from "../../assets/about/1_lignt.svg";
import icon2Dark from "../../assets/about/2_dark.svg";
import icon1Dark from "../../assets/about/1_dark.svg";
import icon2Light from "../../assets/about/2_light.svg";

function Block({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <Box sx={{ flex: "1 1 400px", minWidth: 280 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
        <Box component="img" src={icon} alt="" sx={{ width: 37, height: 37, flexShrink: 0 }} />
        <Box sx={{ fontSize: 20 }}>{title}</Box>
      </Box>
      <Box sx={{ mt: 2, fontSize: 15, whiteSpace: "pre-line" }}>{text}</Box>
    </Box>
  );
}

// Ported from the "ДОСТАВКА"/"ОПЛАТА" blocks in about_page.dart
// (TwoResponsiveBlocks — collapses to one column under ~800px).
export default function AboutDeliveryPayment() {
  return (
    <Box sx={{ px: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>
      <Box sx={{ fontSize: 24, fontWeight: 700, mt: 7 }}>ДОСТАВКА</Box>
      <Box sx={{ mt: 5, display: "flex", flexWrap: "wrap", gap: 4 }}>
        <Block
          icon={icon1Light}
          title="САМОВИВІЗ"
          text={"Самовивіз з магазину в центрі міста\nвул.Богдана Хмельницького 40а/1.\n\nЯкщо ви проживаєте в місті Луцьк, то можете самі забрати ваше замовлення або замовити доставку на таксі по місту за ваш рахунок."}
        />
        <Block
          icon={icon2Dark}
          title="ДОСТАВКА"
          text={"Доставка по Україні та за кордон:\n▪ Відправляємо новою поштою, укрпоштою (з повною передоплатою).\n▪ Відправка здійснюється щодня.\n▪ Всі замовлення, оплачені до 16:00, відправляються в той самий день."}
        />
      </Box>

      <Box sx={{ fontSize: 24, fontWeight: 700, mt: 4 }}>ОПЛАТА</Box>
      <Box sx={{ mt: 5, display: "flex", flexWrap: "wrap", gap: 4 }}>
        <Block icon={icon1Dark} title="НА КАРТУ" text="Оплата на карту ФОП Монобанк" />
        <Block
          icon={icon2Light}
          title="ПІСЛЯПЛАТА"
          text={
            'Оплата при отриманні у відділенні Нової Пошти (передоплата складає 100 грн  і віднімається від загальної суми замовлення, послуга "Наложений Платіж" оплачується клієнтом відповідно до тарифів Нової Пошти 2% від суми + 20грн).'
          }
        />
      </Box>
    </Box>
  );
}
