import { tokenStorageKey } from "@/utils/constants";
import { atomWithStorage } from "jotai/utils";

export const tokenAtom = atomWithStorage<string | null>(tokenStorageKey, null);

export const lastBarcodeAtom = atomWithStorage<{
  content: string;
  updatedAt: number;
}>("last-barcode", {
  content: "",
  updatedAt: 0,
});

export const showTipsAtom = atomWithStorage<"yes" | "no" | "not-sure">(
  "show-tips",
  "not-sure",
  undefined,
  { getOnInit: true },
);
