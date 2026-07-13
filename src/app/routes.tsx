import { createBrowserRouter } from "react-router";
import { Login } from "./pages/Login";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Customers } from "./pages/Customers";
import { CustomerDetails } from "./pages/CustomerDetails";
import { AccountStatement } from "./pages/AccountStatement";
import { WorkOrders } from "./pages/WorkOrders";
import { OrderDetails } from "./pages/OrderDetails";
import { Suppliers } from "./pages/Suppliers";
import { SupplierDetails } from "./pages/SupplierDetails";
import { SupplierOrders } from "./pages/SupplierOrders";
import { Materials } from "./pages/Materials";
import { Inventory } from "./pages/Inventory";
import { Accounts } from "./pages/Accounts";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "customers", Component: Customers },
      { path: "customers/:id", Component: CustomerDetails },
      { path: "customers/:id/account-statement", Component: AccountStatement },
      { path: "work-orders", Component: WorkOrders },
      { path: "work-orders/:id", Component: OrderDetails },
      { path: "suppliers", Component: Suppliers },
      { path: "suppliers/:id", Component: SupplierDetails },
      { path: "supplier-orders", Component: SupplierOrders },
      { path: "materials", Component: Materials },
      { path: "inventory", Component: Inventory },
      { path: "accounts", Component: Accounts },
      { path: "reports", Component: Reports },
      { path: "settings", Component: Settings },
    ],
  },
  {
    path: "/login",
    Component: Login,
  },
]);
