import { connectDB } from "@/lib/mongodb";
import { Product, Message } from "@/models";
import { AdminShell, AdminCard, AdminLinkButton } from "@/components/admin/AdminShell";

export default async function AdminDashboardPage() {
  await connectDB();
  const [productCount, messageCount, unreadCount] = await Promise.all([
    Product.countDocuments(),
    Message.countDocuments(),
    Message.countDocuments({ read: false }),
  ]);

  return (
    <AdminShell
      title="Dashboard"
      subtitle="Overview of your studio site"
      actions={
        <>
          <AdminLinkButton href="/admin/products/new" variant="primary">
            New product
          </AdminLinkButton>
          <AdminLinkButton href="/admin/messages" variant="ghost">
            View messages
          </AdminLinkButton>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <AdminCard>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-metal">Products</p>
          <p className="mt-2 font-serif text-4xl text-cream">{productCount}</p>
        </AdminCard>
        <AdminCard>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-metal">Messages</p>
          <p className="mt-2 font-serif text-4xl text-cream">{messageCount}</p>
        </AdminCard>
        <AdminCard>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-metal">Unread</p>
          <p className="mt-2 font-serif text-4xl text-rust-light">{unreadCount}</p>
        </AdminCard>
      </div>
    </AdminShell>
  );
}
