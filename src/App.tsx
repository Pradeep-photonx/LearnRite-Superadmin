import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./Theme";
import CssBaseline from "@mui/material/CssBaseline";
import Overview from "./pages/Overview";
import Schools from "./pages/Schools";
import SchoolBundles from "./pages/SchoolBundles";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import Layout from "./layouts/Layout";

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <ScrollToTop />
          <Layout>
            <Routes>
              <Route
                path="/"
                element={<Navigate to="/overview" replace />}
              />
              <Route path="/overview" element={<Overview />} />
              <Route path="/schools" element={<Schools />} />
              <Route path="/school-bundles" element={<SchoolBundles />} />
              <Route path="/products" element={<Products />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
