import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/common/AppLayout";
import { LoadingSpinner } from "./components/common/LoadingSpinner";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { BoardPage } from "./pages/BoardPage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { RegisterPage } from "./pages/RegisterPage";

const DashboardPage = lazy(() =>
  import("./pages/DashboardPage").then((module) => ({ default: module.DashboardPage }))
);

const App = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<AppLayout />}>
        <Route path="/board" element={<BoardPage />} />
        <Route
          path="/dashboard"
          element={
            <Suspense fallback={<LoadingSpinner label="Loading insights" />}>
              <DashboardPage />
            </Suspense>
          }
        />
      </Route>
    </Route>
    <Route path="/" element={<Navigate to="/board" replace />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default App;
