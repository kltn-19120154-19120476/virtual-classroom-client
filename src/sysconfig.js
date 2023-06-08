import { createTheme } from "@mui/material/styles";

export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
export const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
export const SERVER_DOMAIN = process.env.NEXT_PUBLIC_SERVER_DOMAIN;
export const WS_DOMAIN = process.env.NEXT_PUBLIC_WS_DOMAIN;
export const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
export const WEB_HOST = process.env.NEXT_PUBLIC_WEB_HOST || "";
export const BBB_SERVER = process.env.NEXT_PUBLIC_BBB_SERVER;
export const BBB_SECRET = process.env.NEXT_PUBLIC_BBB_SECRET;

export const theme = createTheme({
  palette: {
    primary: {
      main: "#467fcf",
    },
    secondary: {
      main: "#cccccc",
    },
  },
});
