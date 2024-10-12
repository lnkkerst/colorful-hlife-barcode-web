import { tokenStorageKey } from "@/utils/constants";
import { atomWithStorage } from "jotai/utils";

export const tokenAtom = atomWithStorage<string | null>(tokenStorageKey, null);
