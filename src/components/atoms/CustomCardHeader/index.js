import { Box, CardHeader, Typography } from "@mui/material";

export const MyCardHeader = ({ label, children }) => (
  <CardHeader
    title={
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" textTransform="uppercase" fontWeight="600" color="white">
          {label}
        </Typography>

        <div>{children}</div>
      </Box>
    }
    sx={{ background: "#467fcf" }}
  ></CardHeader>
);
