import Box from "@mui/material/Box";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

interface NumericStepperProps {
  value: number;
  onChange: (value: number) => void;
  minValue?: number;
  maxValue?: number;
  disabled?: boolean;
}

// Ported from lib/resources/widgets/buttons/numeric_step_button.dart
export default function NumericStepper({
  value,
  onChange,
  minValue = 1,
  maxValue = 10,
  disabled = false,
}: NumericStepperProps) {
  const stepButtonSx = {
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    background: "none",
    borderRadius: "16px",
    cursor: disabled ? "default" : "pointer",
    color: "#161616",
    "&:hover": disabled ? undefined : { backgroundColor: "rgba(22,22,22,0.08)" },
  } as const;

  return (
    <Box
      sx={{
        width: 100,
        height: 42,
        border: "1px solid #161616",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
      }}
    >
      <Box
        component="button"
        aria-label="decrease"
        disabled={disabled}
        onClick={() => value > minValue && onChange(value - 1)}
        sx={stepButtonSx}
      >
        <RemoveIcon sx={{ fontSize: 18 }} />
      </Box>
      <Box component="span" sx={{ fontSize: 18, minWidth: 16, textAlign: "center" }}>
        {value}
      </Box>
      <Box
        component="button"
        aria-label="increase"
        disabled={disabled}
        onClick={() => value < maxValue && onChange(value + 1)}
        sx={stepButtonSx}
      >
        <AddIcon sx={{ fontSize: 18 }} />
      </Box>
    </Box>
  );
}
