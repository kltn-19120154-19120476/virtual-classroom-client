import { ThemeProvider } from "@emotion/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppLayout from "src/components/AppLayout";
import { AuthContextProvider } from "src/context/authContext";
import "src/styles/globals.css";
import { GOOGLE_CLIENT_ID, theme } from "src/sysconfig";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <ToastContainer
          position="top-right"
          autoClose={1500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          limit={1}
        />
        <ThemeProvider theme={theme}>
          <AuthContextProvider>
            <Head>
              <title>BigBlueButton LMS</title>
            </Head>
            <div className="wrapper">
              <AppLayout>
                <Component {...pageProps} />
              </AppLayout>
            </div>
          </AuthContextProvider>
        </ThemeProvider>
      </GoogleOAuthProvider>
    </>
  );
}

export default MyApp;
