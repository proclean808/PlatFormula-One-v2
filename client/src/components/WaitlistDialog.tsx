// Product interaction style: retain the dark racing-control surface and use blue/violet
// accents to make the Free Tier handoff feel native to PlatFormula.ONE rather than a generic form.
import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, LockKeyhole, Mail, Phone, UserRound } from "lucide-react";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type WaitlistDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function WaitlistDialog({ open, onOpenChange }: WaitlistDialogProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const enroll = trpc.waitlist.enroll.useMutation({
    onSuccess: ({ message }) => {
      setSuccessMessage(message);
    },
  });

  useEffect(() => {
    if (user && open) {
      setFullName((current) => current || user.name || "");
      setEmail((current) => current || user.email || "");
    }
  }, [open, user]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage(null);
    enroll.mutate({ fullName, email, phone, consent });
  };

  const closeDialog = (nextOpen: boolean) => {
    if (!nextOpen) {
      setSuccessMessage(null);
      enroll.reset();
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent className="border-blue-500/40 bg-[#10101a] text-foreground sm:max-w-md">
        {successMessage ? (
          <div className="py-7 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-500/10 text-emerald-300">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <DialogTitle className="text-xl">You’re on the list.</DialogTitle>
            <DialogDescription className="leading-relaxed">{successMessage}</DialogDescription>
            <Button onClick={() => closeDialog(false)} className="mt-2 bg-blue-600 text-white hover:bg-blue-700">Done</Button>
          </div>
        ) : !isAuthenticated ? (
          <div className="space-y-5">
            <DialogHeader>
              <DialogTitle className="text-xl text-blue-300">Unlock the Free Tier</DialogTitle>
              <DialogDescription className="leading-relaxed">
                Continue with Google to securely reserve your place and manage your Free Tier waiting-list request.
              </DialogDescription>
            </DialogHeader>
            <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4 text-sm text-muted-foreground">
              <div className="mb-2 flex items-center gap-2 text-blue-300"><LockKeyhole className="h-4 w-4" /> Secure sign-in</div>
              Your account is used to protect your request and prevent duplicate waiting-list entries.
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => closeDialog(false)}>Not now</Button>
              <Button disabled={loading} onClick={startLogin} className="bg-blue-600 text-white hover:bg-blue-700">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Continue with Google
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <DialogHeader>
              <DialogTitle className="text-xl text-blue-300">Join the Free Tier waitlist</DialogTitle>
              <DialogDescription>Reserve your place for the PlatFormula.ONE Free Tier.</DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <Label htmlFor="waitlist-name">Full name</Label>
              <div className="relative"><UserRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input id="waitlist-name" value={fullName} onChange={(event) => setFullName(event.target.value)} className="pl-9" autoComplete="name" required /></div>
              <Label htmlFor="waitlist-email">Email</Label>
              <div className="relative"><Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input id="waitlist-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="pl-9" autoComplete="email" required /></div>
              <Label htmlFor="waitlist-phone">Phone number</Label>
              <div className="relative"><Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input id="waitlist-phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className="pl-9" autoComplete="tel" required /></div>
            </div>

            <label className="flex items-start gap-3 rounded-lg border border-violet-500/20 bg-violet-500/5 p-3 text-xs leading-relaxed text-muted-foreground">
              <input aria-label="Agree to waiting-list contact terms" type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-0.5 h-4 w-4 accent-violet-500" required />
              <span>I agree that PlatFormula.ONE may collect and use my name, email, and phone number to manage my waiting-list request and contact me about Free Tier access and launch updates. I can opt out of non-essential updates at any time.</span>
            </label>

            {enroll.error ? <p role="alert" className="text-sm text-red-300">{enroll.error.message}</p> : null}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => closeDialog(false)}>Cancel</Button>
              <Button type="submit" disabled={enroll.isPending} className="bg-violet-600 text-white hover:bg-violet-700">
                {enroll.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Join waitlist
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
