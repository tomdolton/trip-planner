import AuthGuard from "@/components/Auth/AuthGuard";

export default function TripsLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
