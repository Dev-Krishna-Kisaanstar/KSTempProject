import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

// Role Imports
// Operational Admin Role
import OperationalAdminDashboard from "./Role/OperationalAdmin/OperationalAdminDashboard";
import PrivateRoute from "./Role/OperationalAdmin/Router/PrivateRoute.js";
import OperationalAdminAddAdvisory from "./Role/OperationalAdmin/OperationalAdminAddAdvisory.jsx";
import OperationalAdminShowAddedAdvisor from "./Role/OperationalAdmin/OperationalAdminShowAddedAdvisor.jsx";
import OperationalAdminAdvisoryDetails from "./Role/OperationalAdmin/OperationalAdminAdvisoryDetails.jsx";
import OperationalAdminAddProduct from "./Role/OperationalAdmin/OperationalAdminAddProduct.jsx";
import OperationalAdminShowAddProduct from "./Role/OperationalAdmin/OperationalAdminShowAddProduct.jsx";
import OperationalAdminProductDetails from "./Role/OperationalAdmin/OperationalAdminProductDetails.jsx";
import OperationalAdminEditProduct from "./Role/OperationalAdmin/OperationalAdminEditProduct.jsx";
import OperationalAdminSeeOrders from "./Role/OperationalAdmin/OperationalAdminSeeOrders.jsx";
import OperationalAdminShowConfirmOrders from "./Role/OperationalAdmin/OperationalAdminShowConfirmOrders.jsx";
import AdvisoryOrderSuccess from "./Role/OperationalAdmin/AdvisoryOrderSuccess.jsx";
import OperationalAdminRegister from "./Role/OperationalAdmin/OperationalAdminRegister.jsx"

// Advisory Role
import AdvisoryPrivateRoute from "./Role/Advisory/Router/AdvisoryPrivateRoute.js";
import AdvisoryDashboard from "./Role/Advisory/AdvisoryDashboard.jsx";
import AdvisorySearchCustomer from "./Role/Advisory/AdvisorySearchCustomer.jsx";
import AdvisorySeenewCustomerDetails from "./Role/Advisory/AdvisorySeenewCustomerDetails.jsx";
import ProductList from "./Role/Advisory/Productlist.jsx";
import AdvisorySeeCustomerOldOrders from "./Role/Advisory/AdvisorySeeCustomerOldOrders.jsx";
import AdvisoryAddCustomerRemark from "./Role/Advisory/AdvisoryAddCustomerRemark.jsx";

// General Pages
import Home from "./Pages/Home.jsx";
import LoginComponent from "./components/Login/Login.jsx";

// Font Imports
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* General Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/OperationalAdminRegister" element={<OperationalAdminRegister />} />

          {/* Operational Admin section 👇 */}
          <Route
            path="/operational-admin-dashboard"
            element={
              <PrivateRoute>
                <OperationalAdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/operational-admin-dashboard/add-advisory"
            element={
              <PrivateRoute>
                <OperationalAdminAddAdvisory />
              </PrivateRoute>
            }
          />
          {/* <Route
            path="/OperationalAdminRegister"
            element={
              <PrivateRoute>
                <OperationalAdminRegister />
              </PrivateRoute>
            }
          /> */}
          <Route
            path="/operational-admin-dashboard/list-advisory"
            element={
              <PrivateRoute>
                <OperationalAdminShowAddedAdvisor />
              </PrivateRoute>
            }
          />
          <Route
            path="/operational-admin-dashboard/list-advisory/:id"
            element={
              <PrivateRoute>
                <OperationalAdminAdvisoryDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/operational-admin-dashboard/add-product"
            element={
              <PrivateRoute>
                <OperationalAdminAddProduct />
              </PrivateRoute>
            }
          />
          <Route
            path="/operational-admin-dashboard/list-product"
            element={
              <PrivateRoute>
                <OperationalAdminShowAddProduct />
              </PrivateRoute>
            }
          />
          <Route
            path="/operational-admin-dashboard/list-product/:id"
            element={
              <PrivateRoute>
                <OperationalAdminProductDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/operational-admin-dashboard/list-product/edit-product/:id"
            element={
              <PrivateRoute>
                <OperationalAdminEditProduct />
              </PrivateRoute>
            }
          />
          <Route
            path="/operational-admin-dashboard/list-orders"
            element={
              <PrivateRoute>
                <OperationalAdminSeeOrders />
              </PrivateRoute>
            }
          />
          <Route
            path="/operational-admin-dashboard/show-confirm-orders"
            element={
              <PrivateRoute>
                <OperationalAdminShowConfirmOrders />
              </PrivateRoute>
            }
          />

          {/* Advisory section 👇 */}
          <Route
            path="/advisory-dashboard"
            element={
              <AdvisoryPrivateRoute>
                <AdvisoryDashboard />
              </AdvisoryPrivateRoute>
            }
          />
          <Route
            path="/advisory-dashboard/search-customer"
            element={
              <AdvisoryPrivateRoute>
                <AdvisorySearchCustomer />
              </AdvisoryPrivateRoute>
            }
          />
          <Route
            path="/advisory-dashboard/search-customer/customer-details/:mobileNumber"
            element={
              <AdvisoryPrivateRoute>
                <AdvisorySeenewCustomerDetails />
              </AdvisoryPrivateRoute>
            }
          />
          <Route
            path="/advisory-dashboard/product-list"
            element={
              <AdvisoryPrivateRoute>
                <ProductList />
              </AdvisoryPrivateRoute>
            }
          />
          <Route
            path="/advisory-dashboard/order-success"
            element={
              <AdvisoryPrivateRoute>
                <AdvisoryOrderSuccess />
              </AdvisoryPrivateRoute>
            }
          />
          <Route
            path="/advisory-dashboard/add-remark"
            element={
              <AdvisoryPrivateRoute>
                <AdvisoryAddCustomerRemark />
              </AdvisoryPrivateRoute>
            }
          />
          <Route
            path="/advisory-dashboard/old-orders"
            element={
              <AdvisoryPrivateRoute>
                <AdvisorySeeCustomerOldOrders />
              </AdvisoryPrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;