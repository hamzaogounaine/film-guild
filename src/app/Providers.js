// ./src/app/Providers.js
"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import MainLayout from "./MainLayout";

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <MainLayout>{children}</MainLayout>
    </Provider>
  );
}