// ==========================================================
// Notes  (сторінка списку нотаток) - розмітка сторінки
// SSR (Server-Side Rendering)
// ==========================================================
// Отримання списку нотатків у серверний компонент
// +  npm install use-debounce
// +  npm install @tanstack/react-query
//
// Весь вміст компонента App з попередньої ДЗ перенесено на
// сторінку "/notes", взято з HW-05 вміст компонента "App.tsx"
// ----------------------------------------------------------
// ЗМІНИ === [ДЗ 7: Паралельні маршрути для фільтрації нотаток за тегом] ===
// "app/notes/page.tsx" перенесено в "app/notes/filter/[...slug]/page.tsx"

import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";

import NotesClient from "./Notes.client";

import { Suspense } from "react";
import Loading from "@/app/loading";

// === [ГЛОБАЛЬНІ КОНСТАНТИ НА ПОЧАТКУ ФАЙЛУ] ===
const DEFAULT_PER_PAGE = 10;
const DEFAULT_TAG = "all";

interface PageProps {
  // === [ДЗ 7: Паралельні маршрути для фільтрації нотаток за тегом] ===
  // Додаємо асинхронні параметри динамічного catch-all роуту [...slug]
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function NotesPage({ params, searchParams }: PageProps) {
  // Тестування помилки:
  // throw new Error("Error message");

  // === [ДЗ 7: Паралельні маршрути для фільтрації нотаток за тегом] ===
  // Проводимо асинхронне розгортання динамічних параметрів шляху - resolvedParams
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const currentTag = resolvedParams.slug?.[0] || DEFAULT_TAG;

  // Перевіряємо й виводимо дані саме з об'єкта розгорнутих пошукових параметрів URL
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const searchTerm = resolvedSearchParams.search || "";

  const queryClient = new QueryClient();

  // === [ДЗ 7: Паралельні маршрути для фільтрації нотаток за тегом] ===
  /* Серверне попереднє завантаження кешу даних (Prefetch) перед рендерингом сторінки */
  await queryClient.prefetchQuery({
    // Додаємо поточний тег у ключ кешу, щоб сервер та клієнт мали ідентичну структуру даних - currentTag
    queryKey: ["notes", currentPage, searchTerm, currentTag],

    // Передаємо параметр tag у функцію запиту - tag: currentTag
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage: DEFAULT_PER_PAGE,
        search: searchTerm,
        tag: currentTag,
      }),
  });

  return (
    <Suspense fallback={<Loading />}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesClient
          key={`${currentTag}-${searchTerm}`}
          initialPage={currentPage}
          initialSearch={searchTerm}
          tag={currentTag}
        />
      </HydrationBoundary>
    </Suspense>
  );
}

// ------------
