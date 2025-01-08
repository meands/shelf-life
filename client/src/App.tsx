import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { Home } from "./routes/Home/Home";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Login } from "./components/Login/Login";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
import { Items } from "./routes/Home/Items/Items";
import { ModalsProvider } from "@mantine/modals";
import { Labels } from "./routes/Home/Labels/Labels";
import { globalModals } from "./modals/availableModals";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <MantineProvider>
          <ModalsProvider modals={globalModals}>
            <AppRoutes />
          </ModalsProvider>
        </MantineProvider>
      </BrowserRouter>
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
