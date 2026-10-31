import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login — StudioSpace",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
