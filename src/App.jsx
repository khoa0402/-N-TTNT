import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import contexts
import { UserauthProvider } from "./context/UserauthContext";

// Import private route/link check
import PrivateRouteCheck from "./hocs/PrivateRouteCheck";

// Import hocs
import Layout from "./hocs/Layout";

// Import main pages
import Home from "./pages/Home";

// Import introduction pages
import Features from "./pages/Intro/Features";
import History from "./pages/Intro/History";

// Import authentication pages
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";

// Import bootstrap css
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<UserauthProvider />}>
        <Route exact path="/" element={<PrivateRouteCheck />}>
          <Route exact path="/" element={<Layout />}>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/home" element={<Home />} />
            <Route exact path="/features" element={<Features />} />
            <Route exact path="/history" element={<History />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
