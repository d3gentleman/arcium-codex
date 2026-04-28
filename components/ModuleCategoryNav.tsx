"use client";

import { useEffect, useState } from "react";

interface CategoryNavItem {
  id: string;
  title: string;
  completed: number;
  total: number;
}

export default function ModuleCategoryNav({
  categories,
}: {
  categories: CategoryNavItem[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>(
    categories[0]?.id ?? ""
  );
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    const heroEl = document.querySelector("[data-modules-hero]");
    if (heroEl) {
      const heroObserver = new IntersectionObserver(
        ([entry]) => setIsVisible(!entry.isIntersecting),
        { threshold: 0, rootMargin: "-80px 0px 0px 0px" }
      );
      heroObserver.observe(heroEl);
      observers.push(heroObserver);
    }

    categories.forEach((cat) => {
      const el = document.getElementById(cat.id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveCategory(cat.id);
        },
        { threshold: 0.15, rootMargin: "-100px 0px -50% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [categories]);

  return (
    <div
      className={`sticky top-0 z-40 transition-all duration-500 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "-translate-y-2 opacity-0 pointer-events-none"
      }`}
    >
      <div className="border-b border-outline-variant/10 bg-background/80 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-none">
          <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40">
            Nav
          </span>
          <div className="h-3 w-px bg-outline-variant/15" />
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className={`group flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] transition-all duration-300 ${
                activeCategory === cat.id
                  ? "bg-primary/10 text-primary"
                  : "text-on-surface-variant/40 hover:text-on-surface-variant/70"
              }`}
            >
              <span>{cat.title}</span>
              <span className="flex gap-[3px]">
                {Array.from({ length: cat.total }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-[5px] w-[5px] rounded-full transition-colors ${
                      i < cat.completed ? "bg-primary" : "bg-outline-variant/25"
                    }`}
                  />
                ))}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
