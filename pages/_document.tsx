import { Html, Head, Main, NextScript } from "next/document";

/**
 * Minimal _document for compatibility with tooling (e.g. Sentry) that expects
 * a Pages Router _document. The app uses App Router; this file exists only so
 * module resolution for /_document succeeds during build.
 */
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
