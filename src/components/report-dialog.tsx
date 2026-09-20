import { useState } from "react";
import { CheckCircle2, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CATEGORIES,
  CITY_CENTER,
  SEVERITIES,
  type ReportCategory,
  type Severity,
} from "@/lib/safety";
import { addReport } from "@/lib/store";

export function ReportDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<ReportCategory>("Poor lighting");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<Severity>("Medium");
  const [imageName, setImageName] = useState<string | undefined>();
  const [done, setDone] = useState(false);

  function reset() {
    setLocation("");
    setDescription("");
    setCategory("Poor lighting");
    setSeverity("Medium");
    setImageName(undefined);
    setDone(false);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!location.trim() || !description.trim()) {
      toast.error("Add a location and a short description.");
      return;
    }
    addReport({
      location: location.trim(),
      description: description.trim(),
      category,
      severity,
      imageName,
      lat: CITY_CENTER[0] + (Math.random() - 0.5) * 0.03,
      lng: CITY_CENTER[1] + (Math.random() - 0.5) * 0.03,
    });
    setDone(true);
    toast.success("Report submitted", {
      description: "It now appears on the safety map and dashboard.",
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setTimeout(reset, 200);
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        {done ? (
          <div className="py-6 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">Thanks for the report</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              Your report was added to this prototype and now counts toward the safety
              indicators. Community reports are unverified signals, not confirmed facts.
            </p>
            <div className="mt-5 flex justify-center gap-2">
              <Button variant="outline" onClick={reset}>
                Report another area
              </Button>
              <Button onClick={() => onOpenChange(false)}>Done</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit}>
            <DialogHeader>
              <DialogTitle className="text-xl">Report an area</DialogTitle>
              <DialogDescription>
                Share what you noticed. Reports are community observations and are shown
                as indicators only.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loc">Location</Label>
                <Input
                  id="loc"
                  placeholder="e.g. Northgate Underpass"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={category}
                    onValueChange={(v) => setCategory(v as ReportCategory)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Severity</Label>
                  <Select
                    value={severity}
                    onValueChange={(v) => setSeverity(v as Severity)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SEVERITIES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea
                  id="desc"
                  rows={4}
                  placeholder="What did you see? When did you see it?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="img">Photo (optional)</Label>
                <label
                  htmlFor="img"
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-muted/60"
                >
                  <Upload className="h-4 w-4 shrink-0" />
                  <span className="truncate">{imageName ?? "Attach an image"}</span>
                </label>
                <input
                  id="img"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => setImageName(e.target.files?.[0]?.name)}
                />
              </div>
            </div>

            <DialogFooter className="mt-6 gap-2 sm:gap-2">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit report</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
