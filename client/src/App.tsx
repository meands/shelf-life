import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { Home } from "./routes/Home/Home";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Login } from "./components/Login/Login";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
import { Items } from "./routes/Home/Items/Items";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { Labels } from "./routes/Home/Labels/Labels";
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
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      >
        <Route path="items" element={<Items />} />
        <Route path="labels" element={<Labels />} />
      </Route>
    </Routes>
  );
}

export default App;
