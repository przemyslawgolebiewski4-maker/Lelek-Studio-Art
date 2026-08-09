"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminShell, AdminLinkButton, AdminButton } from "@/components/admin/AdminShell";
import { apiGet, apiPatch, apiDelete, readApiResult } from "@/lib/api";

type ProductRow = {
  _id: string;
  slug: string;
  title: string;
  catalog: string;
  category: string;
  published: boolean;
  order: number;
  isOriginal?: boolean;
};

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProducts() {
    setLoading(true);
    setError("");
    const res = await apiGet("/admin/products");
    const data = await readApiResult<{ products: ProductRow[] }>(res);
    if (!data.ok) {
      setError(data.error);
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
    const data = await readApiResult(res);
    if (data.ok) {
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, published: !published } : p)),
      );
    } else {
      setError(data.error);
    }
  }

  async function deleteProduct(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    const res = await apiDelete(`/admin/products/${id}`);
    const data = await readApiResult(res);
    if (data.ok) {
      setProducts((prev) => prev.filter((p) => p._id !== id));
      router.refresh();
    } else {
      setError(data.error);
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

      {!loading && products.length === 0 ? (
        <div className="admin-form-stack">
          <p className="admin-list-item-title">No products yet</p>
          <p className="admin-muted" style={{ marginBottom: 12 }}>
            Add a piece, then flag Originals for the About page (inquiry only).
          </p>
          <AdminLinkButton href="/admin/products/new" variant="primary">
            Create first product
          </AdminLinkButton>
        </div>
      ) : null}

      {!loading && products.length > 0 && !products.some((p) => p.isOriginal) ? (
        <p className="admin-muted" style={{ marginBottom: 16 }}>
          No Originals flagged yet - open a product and enable &quot;Original (About / Originals)&quot;
          so it appears on /about#originals.
        </p>
      ) : null}

      {products.length > 0 ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Catalog</th>
                <th>Category</th>
                <th>Published</th>
                <th>Original</th>
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
                  <td className="admin-muted">{product.catalog || "-"}</td>
                  <td className="admin-muted">{product.category}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => togglePublished(product._id, product.published)}
                      className={`admin-table-action ${product.published ? "" : "admin-muted"}`}
                    >
                      {product.published ? "LIVE" : "Draft"}
                    </button>
                  </td>
                  <td className="admin-muted">{product.isOriginal ? "Yes" : "-"}</td>
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
