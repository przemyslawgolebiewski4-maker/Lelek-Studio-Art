import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ink" />}>
      <LoginForm />
    </Suspense>
  );
}
