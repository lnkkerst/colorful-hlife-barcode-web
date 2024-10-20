"use client";
import { useEffect } from "react";
import i18next from "i18next";
import { zodI18nMap } from "zod-i18n-map";
import translation from "zod-i18n-map/locales/zh-CN/zod.json";
import { z } from "zod";
import { useAtom } from "jotai";
import { showTipsAtom } from "@/atoms";

export function GlobalEffect() {
  const [showTips, setShowTips] = useAtom(showTipsAtom);

  useEffect(() => {
    i18next.init({
      lng: "zh-CN",
      resources: {
        "zh-CN": { zod: translation },
      },
    });
    z.setErrorMap(zodI18nMap);
  }, []);

  useEffect(() => {
    if (showTips === "not-sure") {
      setShowTips("yes");
    }
  }, [showTips, setShowTips]);

  return null;
}
