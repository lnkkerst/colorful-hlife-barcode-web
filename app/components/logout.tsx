"use client";
import { tokenStorageKey } from "@/utils/constants";
import { useRouter } from "next/navigation";
import { MdExitToApp } from "react-icons/md";

export function LogoutButton() {
  const router = useRouter();

  return (
    <button
      className="btn btn-ghost"
      onClick={e => {
        e.preventDefault();
        localStorage.removeItem(tokenStorageKey);
        router.replace("/login");
      }}
    >
      登出
      <MdExitToApp className="h-6 w-6" />
    </button>
  );
}
