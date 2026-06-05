import { BrowserRouter, Routes, Route } from "react-router-dom";

import AvailableBlood from "./pages/AvailableBlood";
import Login from "./pages/Login";
import RegisterHospital from "./pages/RegisterHospital";
import RegisterReceiver from "./pages/RegisterReceiver";
import AddBlood from "./pages/AddBlood";
import ViewRequests from "./pages/ViewRequests";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<AvailableBlood />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register/hospital"
          element={<RegisterHospital />}
        />

        <Route
          path="/register/receiver"
          element={<RegisterReceiver />}
        />

        <Route
          path="/add-blood"
          element={<AddBlood />}
        />

        <Route
          path="/requests"
          element={<ViewRequests />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
