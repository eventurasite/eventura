import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token");

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (!token) {
      toast.error("Link inválido ou expirado.");
      navigate("/login");
      return;
    }

    async function verify() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/verify-email?token=${token}`);
        const data = await res.json();

        if (res.ok) {
          toast.success("E-mail confirmado com sucesso!");
        } else {
          toast.error(data.message || "Falha ao validar e-mail.");
        }
      } catch (error) {
        console.error(error);
        toast.error("Erro inesperado.");
      }

      navigate("/login");
    }

    verify();
  }, [token, navigate]);

  return null;
}
