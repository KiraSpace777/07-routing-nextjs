// app/notes/filter/@sidebar/default.tsx
// =======================================================
// Фолбек-компонент сайдбару для запобігання Build Error в Next.js
// =======================================================

import Link from "next/link";
import css from "./SidebarNotes.module.css";

// === [ГЛОБАЛЬНІ КОНСТАНТИ] ===
const TAGS = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

export default function DefaultSidebarNotes() {
  // У дефолтному стані жоден динамічний тег не вибрано, тому активним є "All notes"
  return (
    <div className={css.menuList}>
      <ul className={css.menuList}>
        <li className={css.menuItem}>
          <Link href="/notes/filter/all" className={`${css.menuLink} ${css.active}`}>
            All notes
          </Link>
        </li>

        {TAGS.map((tag) => (
          <li key={tag} className={css.menuItem}>
            <Link href={`/notes/filter/${tag}`} className={css.menuLink}>
              {tag}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
