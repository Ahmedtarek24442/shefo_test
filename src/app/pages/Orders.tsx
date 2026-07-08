import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Plus, Search, Filter, Eye } from "lucide-react";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const ordersData = [
  {
    id: "ORD-2401",
    customer: "شركة الفهد التجارية",
    product: "صندوق كرتون 40×30×20",
    quantity: 5000,
    price: "25,000 ريال",
    orderDate: "2024-06-25",
    deliveryDate: "2024-07-05",
    status: "قيد التنفيذ",
  },
  {
    id: "ORD-2402",
    customer: "مؤسسة النور للتغليف",
    product: "صندوق مطبوع بالألوان",
    quantity: 3000,
    price: "18,000 ريال",
    orderDate: "2024-06-24",
    deliveryDate: "2024-07-01",
    status: "مكتمل",
  },
  {
    id: "ORD-2403",
    customer: "شركة الأمل الصناعية",
    product: "كرتون مقوى مزدوج",
    quantity: 7000,
    price: "35,000 ريال",
    orderDate: "2024-06-24",
    deliveryDate: "2024-07-10",
    status: "قيد التنفيذ",
  },
  {
    id: "ORD-2404",
    customer: "مصنع الجودة للكرتون",
    product: "علب هدايا فاخرة",
    quantity: 2000,
    price: "12,000 ريال",
    orderDate: "2024-06-23",
    deliveryDate: "2024-06-28",
    status: "متأخر",
  },
  {
    id: "ORD-2405",
    customer: "شركة التميز التجارية",
    product: "صندوق شحن دولي",
    quantity: 4500,
    price: "22,500 ريال",
    orderDate: "2024-06-23",
    deliveryDate: "2024-07-08",
    status: "قيد المراجعة",
  },
  {
    id: "ORD-2406",
    customer: "مؤسسة الإبداع للتعبئة",
    product: "صندوق كرتون صغير",
    quantity: 10000,
    price: "30,000 ريال",
    orderDate: "2024-06-22",
    deliveryDate: "2024-06-30",
    status: "قيد التنفيذ",
  },
  {
    id: "ORD-2407",
    customer: "شركة الصناعات الحديثة",
    product: "كرتون مموج ثلاثي",
    quantity: 6000,
    price: "36,000 ريال",
    orderDate: "2024-06-22",
    deliveryDate: "2024-07-12",
    status: "قيد التصميم",
  },
  {
    id: "ORD-2408",
    customer: "مصنع الأمانة للورق",
    product: "علب تغليف فاخرة",
    quantity: 1500,
    price: "9,000 ريال",
    orderDate: "2024-06-21",
    deliveryDate: "2024-06-27",
    status: "مكتمل",
  },
];

export function Orders() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = ordersData.filter((order) => {
    const matchesSearch =
      order.id.includes(searchTerm) ||
      order.customer.includes(searchTerm) ||
      order.product.includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "مكتمل":
        return "bg-green-500";
      case "متأخر":
        return "bg-red-500";
      case "قيد التنفيذ":
        return "bg-orange-500";
      case "قيد المراجعة":
        return "bg-blue-500";
      case "قيد التصميم":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">إدارة الطلبات</h1>
          <p className="text-muted-foreground mt-1">عرض ومتابعة جميع الطلبات</p>
        </div>
        <Button className="bg-[#2563EB] hover:bg-[#1E40AF] gap-2">
          <Plus className="w-5 h-5" />
          إضافة طلب جديد
        </Button>
      </div>

      {/* Toolbar */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="البحث عن طلب..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <Filter className="w-4 h-4 ml-2" />
                <SelectValue placeholder="فلترة حسب الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="قيد التنفيذ">قيد التنفيذ</SelectItem>
                <SelectItem value="مكتمل">مكتمل</SelectItem>
                <SelectItem value="متأخر">متأخر</SelectItem>
                <SelectItem value="قيد المراجعة">قيد المراجعة</SelectItem>
                <SelectItem value="قيد التصميم">قيد التصميم</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-right py-4 px-6 font-semibold">رقم الطلب</th>
                  <th className="text-right py-4 px-6 font-semibold">العميل</th>
                  <th className="text-right py-4 px-6 font-semibold">اسم المنتج</th>
                  <th className="text-right py-4 px-6 font-semibold">الكمية</th>
                  <th className="text-right py-4 px-6 font-semibold">السعر</th>
                  <th className="text-right py-4 px-6 font-semibold">تاريخ الطلب</th>
                  <th className="text-right py-4 px-6 font-semibold">موعد التسليم</th>
                  <th className="text-right py-4 px-6 font-semibold">الحالة</th>
                  <th className="text-right py-4 px-6 font-semibold">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-4 px-6 font-bold text-[#2563EB]">
                      {order.id}
                    </td>
                    <td className="py-4 px-6">{order.customer}</td>
                    <td className="py-4 px-6 font-medium">{order.product}</td>
                    <td className="py-4 px-6">
                      {order.quantity.toLocaleString()} قطعة
                    </td>
                    <td className="py-4 px-6 font-medium text-green-600">
                      {order.price}
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">
                      {order.orderDate}
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">
                      {order.deliveryDate}
                    </td>
                    <td className="py-4 px-6">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">إجمالي الطلبات</p>
            <h3 className="text-3xl font-bold">{ordersData.length}</h3>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">قيد التنفيذ</p>
            <h3 className="text-3xl font-bold text-orange-500">
              {ordersData.filter((o) => o.status === "قيد التنفيذ").length}
            </h3>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">مكتمل</p>
            <h3 className="text-3xl font-bold text-green-500">
              {ordersData.filter((o) => o.status === "مكتمل").length}
            </h3>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">متأخر</p>
            <h3 className="text-3xl font-bold text-red-500">
              {ordersData.filter((o) => o.status === "متأخر").length}
            </h3>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">قيمة الطلبات</p>
            <h3 className="text-2xl font-bold text-green-600">187.5K</h3>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
