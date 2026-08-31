import { useState, type ReactNode } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlineOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import NetworkImage from "../common/NetworkImage";
import { storageImageUrl, useBonuses } from "../../api/constants";
import { colors } from "../../theme/theme";
import { formatUkrainianDateTime } from "../../utils/date";
import { buildReceiptPdf } from "../../utils/receiptPdf";
import type { OrderDetail } from "../../api/types";

export const RECEIPT_ACCENT_PINK = "#DD5D79";

interface ReceiptViewProps {
  order: OrderDetail;
  /** The 4th meta row differs between the orders receipt ("Статус:" + a
   * colored badge) and the bonuses receipt ("Тип замовлення:" + plain text)
   * — everything else in the receipt is identical, so this is the only
   * thing callers need to parameterize. */
  metaExtra: { label: string; content: ReactNode };
}

// Shared receipt body — used by both OrderDetailPage ("Замовлення" ›
// receipt) and BonusDetailPage ("Бонуси" › receipt), since a bonus
// transaction is just a view onto the same order data via a different entry
// point (see account/mockBonuses.ts). NOT ported from Dart. "ЗАВАНТАЖИТИ
// ЧЕК" is a visual stub — no receipt-generation endpoint exists.
export default function ReceiptView({ order, metaExtra }: ReceiptViewProps) {
  const [isBuildingPdf, setIsBuildingPdf] = useState(false);

  const handleDownloadReceipt = async () => {
    if (isBuildingPdf) return;
    setIsBuildingPdf(true);
    try {
      // jsPDF's layout work below is synchronous and CPU-bound, so without
      // yielding a frame first the button would just freeze straight into
      // the finished download with the spinner never actually painting.
      await new Promise<void>((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));
      const doc = buildReceiptPdf(order);
      doc.save(`Чек №${order.number}.pdf`);
    } finally {
      setIsBuildingPdf(false);
    }
  };

  return (
    <>
      <Box sx={{ fontSize: 20, fontWeight: 700 }}>№{order.number}</Box>
      <Box sx={{ mt: "4px", mb: 3, fontSize: 13, color: colors.additionalTextColor }}>{order.items.length} позиції</Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}>
        {order.items.map((item, i) => (
          <Box
            key={i}
            sx={{ display: "flex", alignItems: "center", gap: 2, backgroundColor: "rgba(0,0,0,0.02)", borderRadius: "14px", p: 2 }}
          >
            <Box sx={{ width: 64, height: 64, flexShrink: 0 }}>
              <NetworkImage src={item.image ? storageImageUrl(item.image) : ""} alt={item.title} radius={10} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ fontSize: 14, fontWeight: 600 }}>{item.title}</Box>
              <Box sx={{ mt: "2px", fontSize: 12, color: colors.additionalTextColor }}>{item.variant}</Box>
              <Box sx={{ mt: "2px", fontSize: 12, color: colors.additionalTextColor }}>x {item.count}</Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px", flexShrink: 0 }}>
              {useBonuses && item.bonusPoints && (
                <Box
                  component="span"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    backgroundColor: RECEIPT_ACCENT_PINK,
                    color: "#ffffff",
                    borderRadius: "999px",
                    fontSize: 12,
                    fontWeight: 700,
                    px: "10px",
                    py: "2px",
                  }}
                >
                  Б {item.bonusPoints}
                </Box>
              )}
              <Box component="span" sx={{ fontSize: 14, fontWeight: 700 }}>
                {item.price.toFixed(0)} UAH
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 6, mb: 4 }}>
        <Box sx={{ flex: "1 1 260px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <MetaRow label="Дата замовлення:" value={formatUkrainianDateTime(order.createdAt)} />
          <MetaRow label="Номер замовлення:" value={`№${order.number}`} />
          <MetaRow label="Сума замовлення:" value={`${order.sum.toFixed(2)} UAH`} />
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
            <Box component="span" sx={{ fontSize: 13, color: colors.additionalTextColor }}>
              {metaExtra.label}
            </Box>
            {metaExtra.content}
          </Box>
        </Box>

        <Box sx={{ flex: "1 1 300px" }}>
          {/* In-store sale ("Мої покупки") — no delivery happened, so skip
              the address/TTN rows that don't apply and just show who bought
              it. See OrderDetail.isOnline. */}
          <Box sx={{ fontSize: 13, color: colors.additionalTextColor, mb: "10px" }}>
            {order.isOnline ? "Данні доставки:" : "Клієнт:"}
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <DeliveryRow icon={<PhoneOutlinedIcon sx={{ fontSize: 18 }} />} text={order.delivery.phone} />
            <DeliveryRow icon={<PersonOutlineIcon sx={{ fontSize: 18 }} />} text={order.delivery.fullName} />
            {order.isOnline && (
              <>
                <DeliveryRow icon={<PlaceOutlinedIcon sx={{ fontSize: 18 }} />} text={order.delivery.address} />
                <DeliveryRow
                  icon={<DescriptionOutlinedIcon sx={{ fontSize: 18 }} />}
                  text={`Номер декларації: ${order.delivery.declarationNumber}`}
                />
              </>
            )}
          </Box>
        </Box>
      </Box>

      <Box sx={{ borderRadius: "14px", backgroundColor: "rgba(0,0,0,0.02)", p: 3, maxWidth: 480 }}>
        {useBonuses && (
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Box component="span" sx={{ fontSize: 13, color: colors.additionalTextColor }}>
              Нараховані бали:
            </Box>
            <Box component="span" sx={{ fontSize: 13, fontWeight: 700, color: RECEIPT_ACCENT_PINK, display: "flex", alignItems: "center", gap: "4px" }}>
              +{order.bonusesEarned} Б
            </Box>
          </Box>
        )}
        {order.isOnline && (
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Box component="span" sx={{ fontSize: 13, color: colors.additionalTextColor }}>
              Доставка:
            </Box>
            <Box component="span" sx={{ fontSize: 13 }}>
              {order.deliveryFee.toFixed(2)} UAH
            </Box>
          </Box>
        )}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box component="span" sx={{ fontSize: 13, color: colors.additionalTextColor }}>
            Сума замовлення:
          </Box>
          <Box component="span" sx={{ fontSize: 13 }}>
            {order.sum.toFixed(2)} UAH
          </Box>
        </Box>
        <Box sx={{ height: 1, backgroundColor: "rgba(0,0,0,0.08)", mb: 2 }} />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box component="span" sx={{ fontSize: 14, fontWeight: 700 }}>
            Сума разом:
          </Box>
          <Box component="span" sx={{ fontSize: 15, fontWeight: 700 }}>
            {order.sum.toFixed(2)} UAH
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
        <Box
          component="button"
          type="button"
          onClick={handleDownloadReceipt}
          disabled={isBuildingPdf}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            height: 50,
            px: "28px",
            border: "none",
            borderRadius: "10px",
            backgroundColor: colors.mainColor,
            color: "#ffffff",
            fontFamily: "inherit",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.5px",
            cursor: isBuildingPdf ? "default" : "pointer",
            opacity: isBuildingPdf ? 0.75 : 1,
          }}
        >
          {isBuildingPdf && <CircularProgress size={16} thickness={5} sx={{ color: "#ffffff" }} />}
          {isBuildingPdf ? "ЗАВАНТАЖЕННЯ..." : "ЗАВАНТАЖИТИ ЧЕК"}
        </Box>
      </Box>
    </>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
      <Box component="span" sx={{ fontSize: 13, color: colors.additionalTextColor }}>
        {label}
      </Box>
      <Box component="span" sx={{ fontSize: 13, fontWeight: 700 }}>
        {value}
      </Box>
    </Box>
  );
}

function DeliveryRow({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
      <Box sx={{ display: "flex", color: colors.additionalTextColor, mt: "1px" }}>{icon}</Box>
      <Box component="span" sx={{ fontSize: 13 }}>
        {text}
      </Box>
    </Box>
  );
}
