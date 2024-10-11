import { Provider } from "jotai";
import { ReactNode } from "react";

export type ClientProvidersProps = {
  children?: ReactNode;
};

export function ClientProviders({ children }: ClientProvidersProps) {
  return <Provider>{children}</Provider>;
}
