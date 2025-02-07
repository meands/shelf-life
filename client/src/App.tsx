import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { Main } from "./routes/Main/Main";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Login } from "./components/Login/Login";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
import { Items } from "./routes/Main/Items/Items";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { Labels } from "./routes/Main/Labels/Labels";
import { globalModals } from "./modals/availableModals";
import axios from "axios";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
});

axiosInstance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <MantineProvider>
          <Notifications />
          <ModalsProvider modals={globalModals}>
            <AppRoutes />
          </ModalsProvider>
        </MantineProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Main />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/items" replace />} />
        <Route path="items" element={<Items />} />
        <Route path="labels" element={<Labels />} />
      </Route>
    </Routes>
  );
}

export default App;
