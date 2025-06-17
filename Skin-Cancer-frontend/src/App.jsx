import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Registration from "./pages/Registration";
import { Login } from "./pages/Login";
import GenePage from "./pages/GenePage";
import Image from "./pages/ImagePage";
import Fusion from "./pages/Fusion";
import PrivateRoute from "./components/PrivateRoute";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/gene" element={<PrivateRoute><GenePage /></PrivateRoute>} />
          <Route path="/image" element={<PrivateRoute><Image /></PrivateRoute>} />
          <Route path="/fusion" element={<PrivateRoute><Fusion /></PrivateRoute>} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;