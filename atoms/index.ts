import { atomWithStorage } from "jotai/utils";

export const tokenAtom = atomWithStorage<string | null>("hlife365-token", null);
