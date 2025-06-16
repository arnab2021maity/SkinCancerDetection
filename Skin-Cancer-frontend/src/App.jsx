import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Registration from "./pages/Registration";
import { Login } from "./pages/Login";
import GenePage from "./pages/GenePage";
import Image from "./pages/ImagePage";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/gene" element={<GenePage/>} />
          <Route path="/image" element={<Image />} />
          
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;