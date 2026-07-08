import { useParams, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ArrowRight, Package, TrendingUp } from "lucide-react";

const billOfMaterials = [
  {
    material: "كرتون مموج - طبقة واحدة",
    quantity: "1.2 متر مربع",
    purchasePrice: "8 ريال",
    cost: "9.6 ريال",
  },
  {
    material: "غراء صناعي",
    quantity: "0.05 كجم",
    purchasePrice: "25 ريال",
    cost: "1.25 ريال",
  },
  {
    material: "حبر طباعة أسود",
    quantity: "0.01 لتر",
    purchasePrice: "45 ريال",
    cost: "0.45 ريال",
  },
  {
    material: "شريط لاصق",
    quantity: "0.5 رول",
    purchasePrice: "3 ريال",
    cost: "1.5 ريال",
  },
];

export function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const totalMaterialCost = billOfMaterials.reduce(
    (acc, item) => acc + parseFloat(item.cost.replace(" ريال", "")),
    0
  );
  const laborCost = 5;
  const overheadCost = 3;
  const totalManufacturingCost = totalMaterialCost + laborCost + overheadCost;
  const sellingPrice = 25;
  const profit = sellingPrice - totalManufacturingCost;
  const profitMargin = ((profit / sellingPrice) * 100).toFixed(1);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/products")}>
            <ArrowRight className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">تفاصيل المنتج</h1>
            <p className="text-muted-foreground mt-1">صندوق كرتون 40×30×20</p>
          </div>
        </div>
        <Button className="bg-[#F59E0B] hover:bg-[#D97706] gap-2">
          تعديل المنتج
        </Button>
      </div>

      {/* Product Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">تكلفة التصنيع</p>
            <h3 className="text-3xl font-bold">{totalManufacturingCost.toFixed(2)}</h3>
            <p className="text-sm text-muted-foreground">ريال للوحدة</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">سعر البيع</p>
            <h3 className="text-3xl font-bold text-green-600">{sellingPrice}</h3>
            <p className="text-sm text-muted-foreground">ريال للوحدة</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">الربح</p>
            <h3 className="text-3xl font-bold text-green-600">{profit.toFixed(2)}</h3>
            <p className="text-sm text-muted-foreground">ريال للوحدة</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">هامش الربح</p>
            <h3 className="text-3xl font-bold text-green-600">{profitMargin}%</h3>
            <p className="text-sm text-muted-foreground">من سعر البيع</p>
          </CardContent>
        </Card>
      </div>

      {/* Product Information */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>معلومات المنتج</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">اسم المنتج</p>
              <p className="text-lg font-semibold">صندوق كرتون 40×30×20</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">رمز المنتج</p>
              <p className="text-lg font-semibold">PRD-001</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">الفئة</p>
              <p className="text-lg font-semibold">صناديق كرتون قياسية</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">عدد الطلبات</p>
              <p className="text-lg font-semibold">45 طلب</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground mb-2">الوصف</p>
              <p className="text-base">
                صندوق كرتون مموج من طبقة واحدة، المقاسات 40×30×20 سم، مناسب للشحن والتخزين،
                يتحمل وزن حتى 15 كجم
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bill of Materials */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>قائمة المواد (Bill of Materials)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-right py-3 px-4 font-semibold">الخامة</th>
                  <th className="text-right py-3 px-4 font-semibold">الكمية</th>
                  <th className="text-right py-3 px-4 font-semibold">سعر الشراء</th>
                  <th className="text-right py-3 px-4 font-semibold">التكلفة</th>
                </tr>
              </thead>
              <tbody>
                {billOfMaterials.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-muted/30">
                    <td className="py-3 px-4 font-medium">{item.material}</td>
                    <td className="py-3 px-4">{item.quantity}</td>
                    <td className="py-3 px-4 text-muted-foreground">{item.purchasePrice}</td>
                    <td className="py-3 px-4 font-semibold">{item.cost}</td>
                  </tr>
                ))}
                <tr className="border-b bg-muted/30 font-semibold">
                  <td className="py-3 px-4" colSpan={3}>
                    إجمالي تكلفة الخامات
                  </td>
                  <td className="py-3 px-4">{totalMaterialCost.toFixed(2)} ريال</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Manufacturing Cost Summary */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>ملخص تكلفة التصنيع</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-muted-foreground">تكلفة الخامات</span>
              <span className="font-semibold">{totalMaterialCost.toFixed(2)} ريال</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-muted-foreground">تكلفة العمالة</span>
              <span className="font-semibold">{laborCost} ريال</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-muted-foreground">المصاريف الإدارية</span>
              <span className="font-semibold">{overheadCost} ريال</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold">
              <span>إجمالي تكلفة التصنيع</span>
              <span className="text-orange-600">{totalManufacturingCost.toFixed(2)} ريال</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold pt-3 border-t-2">
              <span>سعر البيع</span>
              <span className="text-green-600">{sellingPrice} ريال</span>
            </div>
            <div className="flex justify-between items-center text-xl font-bold bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <span>صافي الربح</span>
              </div>
              <span className="text-green-600">{profit.toFixed(2)} ريال ({profitMargin}%)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
