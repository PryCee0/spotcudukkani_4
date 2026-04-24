import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import { getLoginUrl } from "./const";
import "./index.css";

/**
 * v9.0: Countly SDK — lazy loading ile kritik yoldan çıkarıldı
 * Sayfa yüklendikten sonra idle callback ile başlatılıyor
 * Tasarruf: ~1.8 sn kritik yol gecikmesi eliminasyonu
 */
const initCountly = () => {
  import("countly-sdk-web").then(({ default: Countly }) => {
    Countly.init({
      app_key: "5a04ac6eff80438a2550073c0af3558de4f9082b",
      url: "https://89.117.55.173",
    });
    Countly.q.push(['track_sessions']);
    Countly.q.push(['track_pageview']);
  }).catch(() => {
    // Analytics yüklenemezse sessizce devam et
  });
};

if (typeof requestIdleCallback !== "undefined") {
  requestIdleCallback(initCountly, { timeout: 5000 });
} else {
  setTimeout(initCountly, 3000);
}

/**
 * v10.0: Site ziyaret kaydı — idle callback ile kritik yoldan çıkarıldı
 * Backend'de IP+UA hash ile günlük benzersiz ziyaretçi takibi yapılır
 */
const recordSiteVisit = () => {
  fetch("/api/trpc/stats.recordVisit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
    credentials: "include",
  }).catch(() => {
    // Ziyaret kaydı başarısız olursa sessizce devam et
  });
};

if (typeof requestIdleCallback !== "undefined") {
  requestIdleCallback(recordSiteVisit, { timeout: 8000 });
} else {
  setTimeout(recordSiteVisit, 5000);
}

const queryClient = new QueryClient();

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

  if (!isUnauthorized) return;

  window.location.href = getLoginUrl();
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);
