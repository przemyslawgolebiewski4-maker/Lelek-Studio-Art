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
      subtitle="Manage catalog objects shown in collections and featured works."
      actions={
        <AdminLinkButton href="/admin/products/new" variant="primary">
          New product
        </AdminLinkButton>
      }
    >
      {loading ? <p className="admin-muted">Loading...</p> : null}
      {error ? <p className="admin-error">{error}</p> : null}

      {!loading && products.length === 0 ? <p className="admin-muted">No products yet.</p> : null}

      {products.length > 0 ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Catalog</th>
                <th>Category</th>
                <th>Published</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <div className="admin-soft">{product.title}</div>
                    <div className="admin-table-slug">{product.slug}</div>
                  </td>
                  <td className="admin-muted">{product.catalog || "—"}</td>
                  <td className="admin-muted">{product.category}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => togglePublished(product._id, product.published)}
                      className={`admin-table-action ${product.published ? "" : "admin-muted"}`}
                    >
                      {product.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="admin-muted">{product.order}</td>
                  <td>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      <Link href={`/admin/products/${product._id}/edit`} className="admin-table-action">
                        Edit
                      </Link>
                      <AdminButton
                        variant="danger"
                        onClick={() => deleteProduct(product._id, product.title)}
                        className="admin-table-action"
                        style={{ padding: "2px 6px", minHeight: "auto", border: "none" }}
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
      ) : null}
    </AdminShell>
  );
}
