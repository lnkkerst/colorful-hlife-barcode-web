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
import { useAtom } from "jotai";
import { lastBarcodeAtom } from "@/atoms";

export default function Home() {
  const router = useRouter();
  const [lastBarcode, setLastBarcode] = useAtom(lastBarcodeAtom);
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

      const barcode = result.data.body.idbar;
      setLastBarcode({
        content: barcode,
        updatedAt: Date.now(),
      });

      return barcode;
    },
    { fallbackData: lastBarcode.content },
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
        {!barcode ? (
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
          {isLoading || isValidating ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <MdRefresh className="size-8" />
          )}
        </button>

        {isLoading && !!barcode && (
          <div className="text-center text-warning px-4">
            目前显示的条码为上次获取的内容，
            <span className="text-error">可能已经过期</span>
            。新的条码正在赶来的路上...
          </div>
        )}
        <div className="text-center px-4 text-sm">
          <p>
            TIPS: 可以把本网站添加到桌面，更加方便快捷。支持 PWA
            的浏览器可以将此网站作为 App 安装
          </p>
          <p>{"～(∠・ω< )⌒★"}</p>
        </div>
      </div>

      {token && (
        <div className={clsx("flex items-center justify-end w-full p-6")}>
          <LogoutButton />
        </div>
      )}
    </div>
  );
}
