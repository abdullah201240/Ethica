import { ReviewerShell } from "@/components/dashboard/reviewer-shell"

export default function ReviewerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ReviewerShell>{children}</ReviewerShell>
}
