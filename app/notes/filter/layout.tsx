// app/notes/filter/layout.tsx
// ==========================================================
// FilterLayout - паралельний лейаут для сторінки фільтрації
// Server Component
// ==========================================================

import React, { Suspense } from "react";
import css from "./LayoutNotes.module.css"; // Оновлена назва файлу стилів
import Loading from "@/app/loading";

interface FilterLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export default function FilterLayout({ children, sidebar }: FilterLayoutProps) {
  return (
    <section className={css.container}>
      <aside className={css.sidebar}>{sidebar}</aside>
      <div className={css.notesWrapper}>
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </div>
    </section>
  );
}
