export function resolveImageUrl(url) {
  if (!url) return null;

  // Se já é uma URL completa (Google, GitHub etc)
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Se é uma imagem local salva pelo backend
  const base = import.meta.env.VITE_API_URL;

  // Garante que não duplique barras //
  return `${base.replace(/\/+$/, "")}/${url.replace(/^\/+/, "")}`;
}
