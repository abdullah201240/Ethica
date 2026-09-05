import { ReviewerShell } from "./reviewer-shell"

export default function ReviewerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ReviewerShell>{children}</ReviewerShell>
}
