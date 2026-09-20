import { lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";
import type { LeafletMapProps } from "./leaflet-map";

const LeafletMap = lazy(() => import("./leaflet-map"));

function MapSkeleton({ height }: { height?: string }) {
  return (
    <div
      className="flex w-full animate-pulse items-center justify-center rounded-2xl bg-muted text-sm text-muted-foreground"
      style={{ height: height ?? "100%" }}
    >
      Loading map…
    </div>
  );
}

export function MapPanel(props: LeafletMapProps) {
  return (
    <ClientOnly fallback={<MapSkeleton height={props.height} />}>
      <Suspense fallback={<MapSkeleton height={props.height} />}>
        <LeafletMap {...props} />
      </Suspense>
    </ClientOnly>
  );
}
