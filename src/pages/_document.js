import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="title" content="BigBlueButton - Demo LMS" />
        <meta name="description" content="BigBlueButton - Demo LMS" />
        <meta property="og:title" content="BigBlueButton - Demo LMS" />
        <meta property="og:description" content="BigBlueButton - Demo LMS" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/bbb-logo.png" />
        <link rel="shortcut icon" href="/images/logo.png"></link>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
