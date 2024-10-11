"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";
import useSWR from "swr";
import Barcode from "react-barcode";
import clsx from "clsx";
import { MdRefresh } from "react-icons/md";

export default function Home() {
  const router = useRouter();
  const [token, setToken] = useState<string>("");
  useEffect(() => {
    const result = z.string().safeParse(localStorage.getItem("hlife365-token"));
    if (!result.success) {
      return router.replace("/login");
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
    <div>
      <div
        className={clsx(
          "mt-16",
          "flex flex-col items-center justify-center gap-6",
        )}
      >
        {isLoading || !barcode ? (
          <span className="loading loading-spinner loading-lg"></span>
        ) : (
          <div
            className="rounded overflow-hidden p-2 w-full dark:w-[86%] aspect-video"
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
    </div>
  );
}
