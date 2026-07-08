import { createBrowserRouter } from "react-router";
import { Login } from "./pages/Login";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Customers } from "./pages/Customers";
import { CustomerDetails } from "./pages/CustomerDetails";
import { WorkOrders } from "./pages/WorkOrders";
import { OrderDetails } from "./pages/OrderDetails";
import { Production } from "./pages/Production";
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
      { path: "work-orders", Component: WorkOrders },
      { path: "work-orders/:id", Component: OrderDetails },
      { path: "production", Component: Production },
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
