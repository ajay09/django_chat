import Home from "./pages/Home";
import Server from "./pages/Server";
import Explore from "./pages/Explore";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import ToggleColorMode from "./components/ToggleColorMode";
import Login from "./pages/Login";
import TestLogin from "./pages/TestLogin";
import { AuthServiceProvider } from "./context/AuthContext";
import ProtectedRoute from "./services/ProtectedRoute";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
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
      <Route
        path="/testlogin"
        element={
          <ProtectedRoute>
            <TestLogin />
          </ProtectedRoute>
        }
      />
    </Route>
  )
);

const App = () => {
  return (
    <AuthServiceProvider>
      <ToggleColorMode>
        <RouterProvider router={router} />
      </ToggleColorMode>
    </AuthServiceProvider>
  );
};

export default App;
