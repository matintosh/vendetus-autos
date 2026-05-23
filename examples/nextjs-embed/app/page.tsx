/**
 * Sample contact form. Submits to /api/contact which proxies to vendetus.
 * Mount at app/contact/page.tsx in your Next.js project.
 */
"use client";

import { useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle",
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form.entries())),
    });
    setStatus(res.ok ? "ok" : "error");
  }

  if (status === "ok") {
    return <p>Gracias — tu mensaje le llegó al vendedor.</p>;
  }

  return (
    <form onSubmit={onSubmit}>
      <label>
        Nombre <input name="name" required />
      </label>
      <label>
        Email (opcional) <input name="email" type="email" />
      </label>
      <label>
        Tu pregunta <textarea name="body" required minLength={5} />
      </label>
      <button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Enviando..." : "Enviar"}
      </button>
      {status === "error" && <p>Algo salió mal — probá de nuevo.</p>}
    </form>
  );
}
