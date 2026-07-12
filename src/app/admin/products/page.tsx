"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminShell, AdminLinkButton, AdminButton } from "@/components/admin/AdminShell";
import { apiGet, apiPatch, apiDelete } from "@/lib/api";

type ProductRow = {
  _id: string;
  slug: string;
  title: string;
  catalog: string;
  category: string;
  published: boolean;
  order: number;
};

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProducts() {
    setLoading(true);
    const res = await apiGet("/admin/products");
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setError(data.error ?? "Failed to load products");
      setLoading(false);
      return;
    }
    setProducts(data.products);
    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function togglePublished(id: string, published: boolean) {
    const res = await apiPatch(`/admin/products/${id}`, { published: !published });
    const data = await res.json();
    if (data.ok) {
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, published: !published } : p)),
      );
    }
  }

  async function deleteProduct(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    const res = await apiDelete(`/admin/products/${id}`);
    const data = await res.json();
    if (data.ok) {
      setProducts((prev) => prev.filter((p) => p._id !== id));
      router.refresh();
    }
  }

  return (
    <AdminShell
      title="Products"
      subtitle="Manage catalog objects"
      actions={
        <AdminLinkButton href="/admin/products/new" variant="primary">
          New product
        </AdminLinkButton>
      }
    >
      {loading ? <p className="text-metal">Loading...</p> : null}
      {error ? <p className="text-rust-light">{error}</p> : null}

      {!loading && products.length === 0 ? (
        <p className="text-metal">No products yet.</p>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-sand/20 text-left font-mono text-[10px] uppercase tracking-[0.14em] text-metal">
              <th className="py-3 pr-4">Title</th>
              <th className="py-3 pr-4">Catalog</th>
              <th className="py-3 pr-4">Category</th>
              <th className="py-3 pr-4">Published</th>
              <th className="py-3 pr-4">Order</th>
              <th className="py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b border-sand/10 text-cream">
                <td className="py-3 pr-4">
                  <div className="font-medium">{product.title}</div>
                  <div className="text-xs text-metal">{product.slug}</div>
                </td>
                <td className="py-3 pr-4 text-metal">{product.catalog || "-"}</td>
                <td className="py-3 pr-4 text-metal">{product.category}</td>
                <td className="py-3 pr-4">
                  <button
                    type="button"
                    onClick={() => togglePublished(product._id, product.published)}
                    className={`font-mono text-[10px] uppercase tracking-[0.12em] ${
                      product.published ? "text-cream" : "text-metal"
                    }`}
                  >
                    {product.published ? "Published" : "Draft"}
                  </button>
                </td>
                <td className="py-3 pr-4 text-metal">{product.order}</td>
                <td className="py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/products/${product._id}/edit`}
                      className="font-mono text-[10px] uppercase tracking-[0.12em] text-sand hover:text-cream"
                    >
                      Edit
                    </Link>
                    <AdminButton
                      variant="danger"
                      onClick={() => deleteProduct(product._id, product.title)}
                      className="px-2 py-1 text-[10px]"
                    >
                      Delete
                    </AdminButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
