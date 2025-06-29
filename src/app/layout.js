"use client";

import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import MainLayout from "./MainLayout";


export default function RootLayout({children}) {
  return (
    <html lang="en">
      <link precedence="default" href="https://api.fontshare.com/v2/css?f[]=satoshi@500,700&display=swap" rel="stylesheet" />
      
      <body>

    <Provider store={store}>
      <MainLayout >
        {children}
        </MainLayout>
    </Provider>
      </body>
    </html>

  );
}