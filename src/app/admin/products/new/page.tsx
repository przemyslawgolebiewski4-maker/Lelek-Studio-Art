import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm, productToForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <AdminShell title="New product" subtitle="Add a catalog object">
      <ProductForm initial={productToForm()} />
    </AdminShell>
  );
}
