import React, { useEffect } from "react";

export default function App({ children }) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("authToken", token);

      // garante que a URL fique limpa
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  return <>{children}</>;
}
