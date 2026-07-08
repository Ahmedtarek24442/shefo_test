import { useParams, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ArrowRight, TrendingUp, TrendingDown, Package } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const stockMovementData = [
  { date: "يناير", stock: 12000 },
  { date: "فبراير", stock: 14000 },
  { date: "مارس", stock: 11000 },
  { date: "أبريل", stock: 13500 },
  { date: "مايو", stock: 16000 },
  { date: "يونيو", stock: 15000 },
];

const purchaseHistory = [
  {
    date: "2024-06-26",
    supplier: "شركة الورق المتحدة",
    quantity: 5000,
    price: "8 ريال",
    total: "40,000 ريال",
  },
  {
    date: "2024-05-15",
    supplier: "مؤسسة الخامات الصناعية",
    quantity: 8000,
    price: "7.5 ريال",
    total: "60,000 ريال",
  },
  {
    date: "2024-04-20",
    supplier: "شركة الورق المتحدة",
    quantity: 6000,
    price: "8 ريال",
    total: "48,000 ريال",
  },
  {
    date: "2024-03-10",
    supplier: "مصنع الكرتون الوطني",
    quantity: 4500,
    price: "8.2 ريال",
    total: "36,900 ريال",
  },
];

const movementTimeline = [
  {
    date: "2024-06-27",
    type: "out",
    quantity: 500,
    reason: "استخدام في طلب ORD-2401",
  },
  {
    date: "2024-06-26",
    type: "in",
    quantity: 5000,
    reason: "شراء من شركة الورق المتحدة",
  },
  {
    date: "2024-06-25",
    type: "out",
    quantity: 800,
    reason: "استخدام في طلب ORD-2398",
  },
  {
    date: "2024-06-24",
    type: "out",
    quantity: 1200,
    reason: "استخدام في طلب ORD-2395",
  },
];

export function MaterialDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/materials")}>
            <ArrowRight className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">تفاصيل الخامة</h1>
            <p className="text-muted-foreground mt-1">كرتون مموج - طبقة واحدة</p>
          </div>
        </div>
        <Button className="bg-[#2563EB] hover:bg-[#1E40AF] gap-2">
          <Package className="w-5 h-5" />
          طلب شراء جديد
        </Button>
      </div>

      {/* Material Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">الكمية الحالية</p>
            <h3 className="text-3xl font-bold">15,000</h3>
            <p className="text-sm text-muted-foreground">متر مربع</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">متوسط سعر الشراء</p>
            <h3 className="text-3xl font-bold">8 ريال</h3>
            <p className="text-sm text-muted-foreground">للمتر المربع</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">قيمة المخزون</p>
            <h3 className="text-3xl font-bold text-green-600">120K</h3>
            <p className="text-sm text-muted-foreground">ريال سعودي</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">المتوسط الشهري</p>
            <h3 className="text-3xl font-bold">-2,500</h3>
            <p className="text-sm text-muted-foreground">استهلاك شهري</p>
          </CardContent>
        </Card>
      </div>

      {/* Stock Movement Chart */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>حركة المخزون (6 أشهر)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stockMovementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="stock"
                stroke="#2563EB"
                strokeWidth={3}
                dot={{ fill: "#2563EB", r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Purchase History */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>سجل المشتريات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {purchaseHistory.map((purchase, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{purchase.supplier}</h4>
                      <p className="text-sm text-muted-foreground">{purchase.date}</p>
                    </div>
                    <p className="font-bold text-green-600">{purchase.total}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">الكمية: </span>
                      <span className="font-medium">{purchase.quantity.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">السعر: </span>
                      <span className="font-medium">{purchase.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Movement Timeline */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>سجل الحركة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {movementTimeline.map((movement, index) => (
                <div key={index} className="flex gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      movement.type === "in" ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    {movement.type === "in" ? (
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-semibold">
                        {movement.type === "in" ? "إضافة" : "صرف"} {movement.quantity.toLocaleString()}
                      </h4>
                      <span className="text-sm text-muted-foreground">{movement.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{movement.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
