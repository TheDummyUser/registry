import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/Leaves/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/Leaves/"!</div>
}
