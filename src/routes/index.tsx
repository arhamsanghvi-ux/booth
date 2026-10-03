import { createFileRoute } from "@tanstack/react-router";
import { BoothApp } from "@/components/booth-app";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return <BoothApp />;
}
