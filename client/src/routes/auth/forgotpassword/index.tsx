import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/forgotpassword/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/auth/forgotpassword"!</div>
}
