import { Route, Routes, Navigate } from "react-router";
import AuthLayout from "@/components/layout/AuthLayout";
import { Auth } from "@/screens/Auth";
import MainLayout from "@/components/layout/MainLayout";
import Home from "@/screens/pages/Home";
import "./App.css";
import { useAuth } from "@/context/Auth.context";

function App() {
  const { user } = useAuth();

  console.log("userDetails", user);
  return (
    <Routes>
      {/* Public/Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route
          path="/"
          element={
            !user?.tokens?.access_token ? (
              <Auth />
            ) : (
              <Navigate to="/user/home" />
            )
          }
        />
      </Route>

      {/* Protected Routes */}
      <Route
        path="/user"
        element={
          user?.tokens?.access_token ? <MainLayout /> : <Navigate to="/" />
        }
      >
        <Route path="home" element={<Home />} />
      </Route>

      {/* Catch-all redirect */}
      <Route
        path="*"
        element={
          <Navigate to={user?.tokens?.access_token ? "/user/home" : "/"} />
        }
      />
    </Routes>
  );
}

export default App;
