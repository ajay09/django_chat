import Home from "./pages/Home";
import Server from "./pages/Server";
import Explore from "./pages/Explore";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import ToggleColorMode from "./components/ToggleColorMode";
import Login from "./pages/Login";
import TestLogin from "./pages/TestLogin";
import { AuthServiceProvider } from "./context/AuthContext";
import ProtectedRoute from "./services/ProtectedRoute";
import Register from "./pages/Register";

const App = () => {
  return (
    <BrowserRouter>
      <AuthServiceProvider>
        <ToggleColorMode>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/servers/:serverId/:channelId?"
              element={
                <ProtectedRoute>
                  <Server />
                </ProtectedRoute>
              }
            />
            <Route path="/explore/:categoryName" element={<Explore />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/testlogin"
              element={
                <ProtectedRoute>
                  <TestLogin />
                </ProtectedRoute>
              }
            />
          </Routes>
        </ToggleColorMode>
      </AuthServiceProvider>
    </BrowserRouter>
  );
};

export default App;
