import { UserShell } from "@/components/dashboard/user-shell"

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <UserShell>{children}</UserShell>
}
