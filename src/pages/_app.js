import { GoogleOAuthProvider } from "@react-oauth/google";
import Head from "next/head";
import NextNProgress from "nextjs-progressbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppLayout from "src/components/AppLayout";
import { AuthContextProvider } from "src/context/authContext";
import { SocketProvider } from "src/context/socketContext";
import "src/styles/globals.css";
import { GOOGLE_CLIENT_ID } from "src/sysconfig";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <SocketProvider>
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
          <AuthContextProvider>
            <NextNProgress color="#1976d2" />
            <Head>
              <title>DEMO CLASSROOM</title>
            </Head>
            <div className="wrapper">
              <AppLayout>
                <Component {...pageProps} />
              </AppLayout>
            </div>
          </AuthContextProvider>
        </SocketProvider>
      </GoogleOAuthProvider>
    </>
  );
}

export default MyApp;
