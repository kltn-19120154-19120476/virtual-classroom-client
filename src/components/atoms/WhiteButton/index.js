import styled from "@emotion/styled";
import { Button } from "@mui/material";

export const WhiteButton = styled(Button)({
  backgroundColor: "#fff",
  borderColor: "#fff",
  "&:hover": {
    backgroundColor: "#f9f9f9",
    borderColor: "#fff",
  },
  "&:active": {
    backgroundColor: "#fff",
    borderColor: "#fff",
  },
  "&:focus": {
    boxShadow: "none",
    borderColor: "transparent",
  },
});
