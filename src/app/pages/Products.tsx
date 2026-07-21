import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, Plus, Eye } from "lucide-react";
import { toast } from "sonner";
import api from "../../services/api";
import { Modal, FormField, ModalFooter, inputCls, selectCls } from "../components/Modal";

export function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [availableMaterials, setAvailableMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", sellPrice: "", sizes: "" });
  const [selectedMaterials, setSelectedMaterials] = useState<{ materialId: string; quantity: string }[]>([]);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, matRes] = await Promise.all([
        api.get('/products'),
        api.get('/inventory'),
      ]);
      setProducts(prodRes.data);
      setAvailableMaterials(matRes.data);
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name?.includes(searchTerm)
  );

  const handleAddMaterialRow = () => {
    setSelectedMaterials([...selectedMaterials, { materialId: "", quantity: "1" }]);
  };

  const handleRemoveMaterialRow = (idx: number) => {
    setSelectedMaterials(selectedMaterials.filter((_, i) => i !== idx));
  };

  const handleMaterialChange = (idx: number, field: string, val: string) => {
    const copy = [...selectedMaterials];
    copy[idx] = { ...copy[idx], [field]: val };
    setSelectedMaterials(copy);
  };

  const handleSubmitProduct = async () => {
    if (!newProduct.name || !newProduct.sellPrice || !newProduct.sizes) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    const formattedMaterials = [];
    for (const item of selectedMaterials) {
      if (!item.materialId || !item.quantity) {
        toast.error("يرجى إكمال بيانات جميع الخامات المضافة");
        return;
      }
      formattedMaterials.push({
        materialId: parseInt(item.materialId),
        quantity: parseInt(item.quantity),
      });
    }

    setSaving(true);
    try {
      await api.post("/products", {
        name: newProduct.name,
        sellPrice: parseInt(newProduct.sellPrice),
        sizes: newProduct.sizes,
        materials: formattedMaterials,
      });
      toast.success("تمت إضافة المنتج بنجاح");
      setShowAddModal(false);
      setNewProduct({ name: "", sellPrice: "", sizes: "" });
      setSelectedMaterials([]);
      
      // refresh
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "حدث خطأ أثناء إضافة المنتج");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center" dir="rtl">جاري التحميل...</div>;

  return (
    <div className="space-y-5" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">المنتجات</h1>
          <p className="text-slate-500 text-sm mt-0.5">إجمالي {products.length} منتج</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-[#2563EB] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#1E40AF] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          إضافة منتج جديد
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "إجمالي المنتجات", value: products.length, color: "text-[#2563EB]", bg: "bg-blue-50" },
          { label: "عدد الخامات المرتبطة", value: products.reduce((sum, p) => sum + (p.materials?.length || 0), 0), color: "text-purple-600", bg: "bg-purple-50" },
          { label: "متوسط سعر البيع", value: products.length > 0 ? `${Math.round(products.reduce((sum, p) => sum + p.sellPrice, 0) / products.length)} ريال` : "—", color: "text-green-600", bg: "bg-green-50" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-slate-100`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <div className="relative max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="البحث عن منتج..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-9 bg-slate-50 rounded-lg pr-9 pl-4 text-sm border border-slate-200 outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["#", "اسم المنتج", "المقاسات", "سعر البيع", "عدد الخامات", ""].map((h) => (
                  <th key={h} className="text-right py-3 px-4 text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors cursor-pointer"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  <td className="py-3 px-4 font-mono text-xs text-[#2563EB] font-bold">{product.id}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{product.name}</td>
                  <td className="py-3 px-4 text-slate-500 text-xs">{product.sizes || "—"}</td>
                  <td className="py-3 px-4 font-semibold text-green-600">{product.sellPrice} ريال</td>
                  <td className="py-3 px-4">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-purple-100 text-purple-700">
                      {product.materials?.length || 0} خامة
                    </span>
                  </td>
                  <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => navigate(`/products/${product.id}`)}
                      className="flex items-center gap-1 text-xs text-[#2563EB] font-medium hover:text-[#1E40AF]"
                    >
                      <Eye className="w-3.5 h-3.5" /> عرض
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">لا توجد منتجات مطابقة للبحث</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="إضافة منتج جديد" width="max-w-xl">
        <div className="space-y-4">
          <FormField label="اسم المنتج" required>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct(p => ({ ...p, name: e.target.value }))}
              placeholder="مثال: صندوق كرتون مقوى 40×30×20"
              className={inputCls}
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="سعر البيع (ريال)" required>
              <input
                type="number"
                value={newProduct.sellPrice}
                onChange={(e) => setNewProduct(p => ({ ...p, sellPrice: e.target.value }))}
                placeholder="25"
                className={inputCls}
              />
            </FormField>
            <FormField label="المقاسات" required>
              <input
                type="text"
                value={newProduct.sizes}
                onChange={(e) => setNewProduct(p => ({ ...p, sizes: e.target.value }))}
                placeholder="مثال: 40×30×20"
                className={inputCls}
              />
            </FormField>
          </div>

          <div className="border-t border-slate-100 pt-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-700">الخامات المكونة للمنتج:</h4>
              <button
                type="button"
                onClick={handleAddMaterialRow}
                className="text-xs text-[#2563EB] hover:text-[#1E40AF] font-bold flex items-center gap-1"
              >
                + إضافة خام
              </button>
            </div>
            
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {selectedMaterials.map((row, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg">
                  <div className="flex-1">
                    <select
                      value={row.materialId}
                      onChange={(e) => handleMaterialChange(idx, "materialId", e.target.value)}
                      className={selectCls}
                    >
                      <option value="">اختر الخامة...</option>
                      {availableMaterials.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      placeholder="الكمية"
                      value={row.quantity}
                      onChange={(e) => handleMaterialChange(idx, "quantity", e.target.value)}
                      className={inputCls}
                      min="1"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMaterialRow(idx)}
                    className="text-red-500 hover:text-red-700 text-xs font-bold"
                  >
                    حذف
                  </button>
                </div>
              ))}
              {selectedMaterials.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-2">لا توجد خامات مضافة حالياً. اضغط على "+ إضافة خام" لربط خامات بهذا المنتج.</p>
              )}
            </div>
          </div>
        </div>
        <ModalFooter
          onClose={() => setShowAddModal(false)}
          onConfirm={handleSubmitProduct}
          confirmLabel="حفظ المنتج"
          loading={saving}
        />
      </Modal>
    </div>
  );
}
