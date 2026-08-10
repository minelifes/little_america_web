import { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CloseIcon from "../common/CloseIcon";
import { storageImageUrl } from "../../api/constants";
import { whiteIconHoverSx } from "../../theme/interactions";
import type { ImageModel } from "../../api/types";

// Ported from lib/resources/widgets/image_gallery.dart. The Flutter version
// zooms the main image on hover/drag (ImageZoomOnMove); per request this
// port instead opens a full-size lightbox on click.
export default function ImageGallery({ images, title }: { images: ImageModel[]; title: string }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  const selected = images[selectedIndex];
  const mainUrl = selected ? storageImageUrl(selected.url) : "";

  return (
    <>
      <Box sx={{ display: "flex", gap: 2, px: 2 }}>
        <Box
          sx={{
            width: 80,
            height: 400,
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            overflowY: "auto",
            flexShrink: 0,
          }}
        >
          {images.map((img, i) => {
            const isSelected = i === selectedIndex;
            return (
              <Box
                key={img.id ?? i}
                component="button"
                onClick={() => setSelectedIndex(i)}
                sx={{
                  width: 80,
                  height: 80,
                  flexShrink: 0,
                  p: 0,
                  borderRadius: "8px",
                  border: `2px solid ${isSelected ? "#161616" : "#ffffff"}`,
                  boxShadow: isSelected ? "none" : "0 0 0 1px rgba(0,0,0,0.08)",
                  overflow: "hidden",
                  cursor: isSelected ? "default" : "pointer",
                  backgroundColor: "#ffffff",
                }}
              >
                <Box
                  component="img"
                  src={storageImageUrl(img.url)}
                  alt={`${title} — фото ${i + 1}`}
                  sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </Box>
            );
          })}
        </Box>

        <Box
          onClick={() => mainUrl && setZoomOpen(true)}
          sx={{
            flex: 1,
            height: 400,
            borderRadius: "16px",
            backgroundColor: "#ffffff",
            border: "1px solid #f0f0f0",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: mainUrl ? "zoom-in" : "default",
          }}
        >
          {mainUrl && (
            <Box
              component="img"
              src={mainUrl}
              alt={title}
              sx={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
            />
          )}
        </Box>
      </Box>

      <Modal open={zoomOpen} onClose={() => setZoomOpen(false)}>
        <Box
          onClick={() => setZoomOpen(false)}
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            outline: "none",
          }}
        >
          <Box
            component="button"
            onClick={() => setZoomOpen(false)}
            aria-label="close"
            sx={{
              position: "absolute",
              top: 24,
              right: 24,
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "none",
              backgroundColor: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              ...whiteIconHoverSx,
            }}
          >
            <CloseIcon />
          </Box>
          <Box
            component="img"
            src={mainUrl}
            alt={title}
            onClick={(e) => e.stopPropagation()}
            sx={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              objectFit: "contain",
              borderRadius: "8px",
              cursor: "default",
            }}
          />
        </Box>
      </Modal>
    </>
  );
}
