"use client";
import { tokenStorageKey } from "@/utils/constants";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdExitToApp } from "react-icons/md";

export function LogoutButton() {
  const router = useRouter();
  const [routing, setRouting] = useState(false);

  return (
    <button
      className="btn btn-ghost"
      disabled={routing}
      onClick={e => {
        e.preventDefault();
        localStorage.removeItem(tokenStorageKey);
        setRouting(true);
        router.replace("/login");
      }}
    >
      登出
      {routing ? (
        <span className="loading loading-spinner h-6 w-6"></span>
      ) : (
        <MdExitToApp className="h-6 w-6" />
      )}
    </button>
  );
}
