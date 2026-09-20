import { useState } from "react";
import { MapPin, Phone, ShieldAlert, Users } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EMERGENCY_CONTACTS } from "@/lib/safety";

export function EmergencyPanel({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [coords, setCoords] = useState<string | null>(null);
  const [confirmCall, setConfirmCall] = useState(false);

  function shareLocation() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setCoords("Location unavailable in this browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const text = `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;
        setCoords(text);
        toast.success("Location ready to share", {
          description: `Copy and send this to a trusted contact: ${text}`,
        });
      },
      () => setCoords("Permission denied — you can still call a contact below"),
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-destructive/10 text-destructive">
              <ShieldAlert className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <DialogTitle className="text-xl">Emergency help</DialogTitle>
              <DialogDescription>
                Nothing is sent automatically. Every action needs your confirmation.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-muted/50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <MapPin className="h-4 w-4 text-primary" /> Share my location
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Fetches your device location so you can send it to someone you trust.
            </p>
            <Button className="mt-3" size="sm" onClick={shareLocation}>
              Get my location
            </Button>
            {coords && (
              <p className="mt-2 rounded-lg bg-background px-3 py-2 text-sm font-medium">
                {coords}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Users className="h-4 w-4 text-primary" /> Emergency contacts
              <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                Demo contacts
              </span>
            </div>
            <ul className="mt-3 space-y-2">
              {EMERGENCY_CONTACTS.map((c) => (
                <li
                  key={c.name}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg bg-muted/50 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{c.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {c.relation} · {c.phone}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0"
                    onClick={() =>
                      toast("Confirm before calling", {
                        description: `This prototype does not place real calls to ${c.name}.`,
                      })
                    }
                  >
                    Call
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-destructive">
              <Phone className="h-4 w-4" /> Call emergency services
            </div>
            {confirmCall ? (
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setConfirmCall(false);
                    toast.error("Demo only", {
                      description:
                        "In a live deployment this would dial your local emergency number.",
                    });
                  }}
                >
                  Yes, place the call
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setConfirmCall(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="destructive"
                size="sm"
                className="mt-3"
                onClick={() => setConfirmCall(true)}
              >
                Start call
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
