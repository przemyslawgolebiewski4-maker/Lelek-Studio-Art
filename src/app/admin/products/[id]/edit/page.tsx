"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm, productToForm, type ProductFormData } from "@/components/admin/ProductForm";
import { apiGet, readApiResult } from "@/lib/api";
import type { Product } from "@/types/product";

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const [initial, setInitial] = useState<ProductFormData | null>(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      const res = await apiGet(`/admin/products/${id}`);
      const data = await readApiResult<{ product: Product }>(res);
      if (!data.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }
      setInitial(productToForm(data.product));
      setTitle(data.product.title);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <AdminShell title="Edit product" subtitle="Loading...">
        <p className="admin-muted">Loading...</p>
      </AdminShell>
    );
  }

  if (error || !initial) {
    return (
      <AdminShell title="Edit product" subtitle="Error">
        <p className="admin-error">{error || "Not found"}</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Edit product" subtitle={title}>
      <ProductForm initial={initial} productId={id} />
    </AdminShell>
  );
}
