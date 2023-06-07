import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="title" content="Big Blue Button" />
        <meta name="description" content="Big Blue Button" />
        <meta property="og:title" content="Big Blue Button" />
        <meta property="og:description" content="Big Blue Button" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/bbb-logo.png" />
        <link rel="shortcut icon" href="/images/bbb-logo.png"></link>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
