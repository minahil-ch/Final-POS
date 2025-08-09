// context/PageContentContext.tsx
'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { usePathname } from 'next/navigation';

type PageMap = Record<string, string>;

type PageContentContextType = {
  pageMap: PageMap;
  updatePageContent: (key: string, text: string) => void;
  getCombinedContext: () => string;
  scanAllRoutes: (routes: string[]) => Promise<void>;
  scanCurrentPage: () => void;
};

const STORAGE_KEY = 'ai_page_map_v1';
const PageContentContext = createContext<PageContentContextType | undefined>(
  undefined
);

export function PageContentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [pageMap, setPageMap] = useState<PageMap>({});
  const observerRef = useRef<MutationObserver | null>(null);
  const debounceRef = useRef<number | null>(null);

  // Load from storage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPageMap(JSON.parse(raw));
    } catch (e) {
      console.warn('ai: load map failed', e);
    }
  }, []);

  const persist = (map: PageMap) => {
    setPageMap(map);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    } catch (e) {
      console.warn('ai: persist map failed', e);
    }
  };

  const updatePageContent = (key: string, text: string) => {
    const next = { ...pageMap, [key]: text };
    persist(next);
  };

  const extractTextFromDoc = (doc?: Document | Element | null) => {
    if (!doc) return '';

    let root: Element | Document | null =
      doc instanceof Document
        ? doc.querySelector('[data-ai-content]') ||
          doc.querySelector('main') ||
          doc.body
        : doc;

    if (!root && typeof document !== 'undefined') {
      root =
        document.querySelector('[data-ai-content]') ||
        document.querySelector('main') ||
        document.body;
    }

    if (!root) return '';

    if ('textContent' in root && root.textContent) {
      return root.textContent;
    }
    if (root instanceof HTMLElement && root.innerText) {
      return root.innerText;
    }
    return '';
  };

  const scanCurrentPage = () => {
    if (typeof window === 'undefined') return;
    const key = window.location.pathname || 'unknown';
    const text = extractTextFromDoc(document);
    updatePageContent(key, text);
  };

  // Rescan whenever route changes
  useEffect(() => {
    scanCurrentPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Observe changes on current page
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const target =
      document.querySelector('[data-ai-content]') ||
      document.querySelector('main') ||
      document.body;
    if (!target) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new MutationObserver(() => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      debounceRef.current = window.setTimeout(() => {
        scanCurrentPage();
      }, 400);
    });

    observerRef.current.observe(target, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  // Fetch and scan other pages
  const scanUrl = async (url: string) => {
    try {
      const res = await fetch(url, { credentials: 'same-origin' });
      const html = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const text = extractTextFromDoc(doc);
      updatePageContent(url, text);
    } catch (e) {
      console.warn('ai: scanUrl failed', url, e);
    }
  };

  const scanAllRoutes = async (routes: string[]) => {
    const normalized = routes.map((r) => (r.startsWith('/') ? r : `/${r}`));
    await Promise.all(normalized.map((r) => scanUrl(r)));
  };

  const getCombinedContext = () => {
    const keys = Object.keys(pageMap).sort();
    if (keys.length === 0) return '';
    return keys
      .map((k) => `=== PAGE: ${k} ===\n${pageMap[k]}\n`)
      .join('\n');
  };

  return (
    <PageContentContext.Provider
      value={{
        pageMap,
        updatePageContent,
        getCombinedContext,
        scanAllRoutes,
        scanCurrentPage,
      }}
    >
      {children}
    </PageContentContext.Provider>
  );
}

export function usePageContent() {
  const context = useContext(PageContentContext);
  if (!context) {
    throw new Error(
      'usePageContent must be used within PageContentProvider'
    );
  }
  return context;
}
