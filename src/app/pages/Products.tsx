import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Plus, Search, Filter, Eye } from "lucide-react";

const productsData = [
  {
    id: 1,
    name: "صندوق كرتون 40×30×20",
    sellingPrice: "5 ريال",
    manufacturingCost: "3 ريال",
    profit: "2 ريال",
    profitMargin: "40%",
    orders: 45,
  },
  {
    id: 2,
    name: "صندوق مطبوع بالألوان",
    sellingPrice: "6 ريال",
    manufacturingCost: "3.5 ريال",
    profit: "2.5 ريال",
    profitMargin: "42%",
    orders: 38,
  },
  {
    id: 3,
    name: "كرتون مقوى مزدوج",
    sellingPrice: "5.5 ريال",
    manufacturingCost: "3.2 ريال",
    profit: "2.3 ريال",
    profitMargin: "42%",
    orders: 32,
  },
  {
    id: 4,
    name: "علب هدايا فاخرة",
    sellingPrice: "8 ريال",
    manufacturingCost: "4.5 ريال",
    profit: "3.5 ريال",
    profitMargin: "44%",
    orders: 28,
  },
  {
    id: 5,
    name: "صندوق شحن دولي",
    sellingPrice: "7 ريال",
    manufacturingCost: "4 ريال",
    profit: "3 ريال",
    profitMargin: "43%",
    orders: 25,
  },
  {
    id: 6,
    name: "صندوق كرتون صغير",
    sellingPrice: "3 ريال",
    manufacturingCost: "1.8 ريال",
    profit: "1.2 ريال",
    profitMargin: "40%",
    orders: 22,
  },
  {
    id: 7,
    name: "كرتون مموج ثلاثي",
    sellingPrice: "6.5 ريال",
    manufacturingCost: "3.8 ريال",
    profit: "2.7 ريال",
    profitMargin: "42%",
    orders: 20,
  },
  {
    id: 8,
    name: "علب تغليف فاخرة",
    sellingPrice: "9 ريال",
    manufacturingCost: "5 ريال",
    profit: "4 ريال",
    profitMargin: "44%",
    orders: 18,
  },
];

export function Products() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = productsData.filter((product) =>
    product.name.includes(searchTerm)
  );

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">المنتجات</h1>
          <p className="text-muted-foreground mt-1">عرض وإدارة كتالوج المنتجات</p>
        </div>
        <Button className="bg-[#2563EB] hover:bg-[#1E40AF] gap-2">
          <Plus className="w-5 h-5" />
          إضافة منتج جديد
        </Button>
      </div>

      {/* Toolbar */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="البحث عن منتج..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-5 h-5" />
              فلترة
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-right py-4 px-6 font-semibold">اسم المنتج</th>
                  <th className="text-right py-4 px-6 font-semibold">سعر البيع</th>
                  <th className="text-right py-4 px-6 font-semibold">تكلفة التصنيع</th>
                  <th className="text-right py-4 px-6 font-semibold">الربح</th>
                  <th className="text-right py-4 px-6 font-semibold">هامش الربح</th>
                  <th className="text-right py-4 px-6 font-semibold">عدد الطلبات</th>
                  <th className="text-right py-4 px-6 font-semibold">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-6 font-medium">{product.name}</td>
                    <td className="py-4 px-6 font-semibold text-green-600">
                      {product.sellingPrice}
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">
                      {product.manufacturingCost}
                    </td>
                    <td className="py-4 px-6 font-semibold text-green-600">
                      {product.profit}
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {product.profitMargin}
                      </span>
                    </td>
                    <td className="py-4 px-6">{product.orders}</td>
                    <td className="py-4 px-6">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate(`/products/${product.id}`)}
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">إجمالي المنتجات</p>
            <h3 className="text-3xl font-bold">{productsData.length}</h3>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">متوسط هامش الربح</p>
            <h3 className="text-3xl font-bold text-green-600">42%</h3>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">إجمالي الطلبات</p>
            <h3 className="text-3xl font-bold">
              {productsData.reduce((acc, p) => acc + p.orders, 0)}
            </h3>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">الأكثر طلباً</p>
            <h3 className="text-xl font-bold">{productsData[0].name}</h3>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
