import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="title" content="Hanzi Dict" />
        <meta name="description" content="Meow Classroom" />
        <meta property="og:title" content="Meow Classroom" />
        <meta property="og:description" content="Meow Classroom" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/logo.png" />
        <link rel="shortcut icon" href="/images/logo.png"></link>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
