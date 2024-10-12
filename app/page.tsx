"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";
import useSWR from "swr";
import Barcode from "react-barcode";
import clsx from "clsx";
import { MdRefresh } from "react-icons/md";
import { tokenStorageKey } from "@/utils/constants";
import { LogoutButton } from "./components/logout";

export default function Home() {
  const router = useRouter();
  const [token, setToken] = useState<string>("");
  useEffect(() => {
    const result = z.string().safeParse(localStorage.getItem(tokenStorageKey));
    if (!result.success) {
      router.replace("/login");
      return;
    }
    setToken(result.data);
  }, [router]);

  const {
    data: barcode,
    isLoading,
    isValidating,
    mutate,
  } = useSWR(
    () => token && "token",
    async () => {
      const response = await fetch(
        "https://api.hlife365.cn/hlifecore/idbar/flush/v1.0",
        {
          headers: {
            "user-agent":
              "ColorfulSchool/2.1.0 (M2012K11AG; Android 13; Scale/3.00)",
            accesstoken: token,
            token,
          },
        },
      );

      const json = await response.json();

      const result = z
        .object({
          body: z.object({
            idbar: z.string(),
          }),
        })
        .safeParse(json);

      if (!result.success) {
        return router.replace("/login");
      }

      return result.data.body.idbar;
    },
  );

  return (
    <div
      className={clsx(
        "min-h-dvh",
        "flex flex-col items-center justify-between",
      )}
    >
      <div
        className={clsx(
          "mt-12 w-full",
          "flex flex-col items-center justify-center gap-6",
        )}
      >
        {isLoading || !barcode ? (
          <span className="loading loading-spinner loading-lg"></span>
        ) : (
          <div
            className={clsx(
              "rounded overflow-hidden p-2 w-full dark:w-[86%] max-w-[540px] aspect-video",
            )}
            data-theme="light"
          >
            <Barcode
              value={barcode!}
              height={150}
              displayValue={false}
              background="transparent"
              lineColor="currentColor"
              // @ts-expect-error className type not forwarded
              className="w-full h-full"
            ></Barcode>
          </div>
        )}

        <button
          className="btn btn-circle btn-ghost btn-lg"
          disabled={isLoading || isValidating}
          onClick={e => {
            e.preventDefault();
            mutate();
          }}
        >
          <MdRefresh className="w-8 h-8" />
        </button>
      </div>

      {token && (
        <div className={clsx("flex items-center justify-end w-full p-6")}>
          <LogoutButton />
        </div>
      )}
    </div>
  );
}
