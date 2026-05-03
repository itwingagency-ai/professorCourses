/* eslint-disable @typescript-eslint/no-unused-vars */

import type { AppProps } from "next/app";

export default function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />
}
