import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm, productToForm } from "@/components/admin/ProductForm";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  await connectDB();
  const product = await Product.findById(id).lean();
  if (!product) notFound();

  return (
    <AdminShell title="Edit product" subtitle={product.title}>
      <ProductForm
        initial={productToForm({
          ...product,
          _id: product._id,
        })}
        productId={id}
      />
    </AdminShell>
  );
}
