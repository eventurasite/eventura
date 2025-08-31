import React from "react";

export default function AuthLayout({ left, children }) {
  return (
    <section className="login-wrap">
      <aside className="login-side">
        {left}
      </aside>
      <main className="login-card">
        <div className="card">
          {children}
        </div>
      </main>
    </section>
  );
}
