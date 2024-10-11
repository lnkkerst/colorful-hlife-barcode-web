"use client";
import { useEffect } from "react";
import i18next from "i18next";
import { zodI18nMap } from "zod-i18n-map";
import translation from "zod-i18n-map/locales/zh-CN/zod.json";
import { z } from "zod";

export function GlobalEffect() {
  useEffect(() => {
    i18next.init({
      lng: "zh-CN",
      resources: {
        "zh-CN": { zod: translation },
      },
    });
    z.setErrorMap(zodI18nMap);
  }, []);
  return null;
}
