import { GoogleOAuthProvider } from "@react-oauth/google";
import Head from "next/head";
import NextNProgress from "nextjs-progressbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppLayout from "../components/AppLayout";
import { AuthContextProvider } from "../context/authContext";
import { SocketProvider } from "../context/socketContext";
import "../styles/globals.css";
import { GOOGLE_CLIENT_ID } from "../sysconfig";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <SocketProvider>
          <ToastContainer position="top-right" autoClose={1500} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" limit={1}/>
          <AuthContextProvider>
            <NextNProgress color="#1976d2" />
            <Head>
              <title>Meow Classrrom</title>
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
