import { Suspense } from "react";
import LoginForm from "./LoginForm";
import "../admin.css";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="admin-login-wrap admin-muted">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
