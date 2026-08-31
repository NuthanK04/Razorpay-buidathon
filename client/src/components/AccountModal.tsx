import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Package, Shield, Clock } from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccountModal({ isOpen, onClose }: AccountModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        />

        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-background p-6 text-left shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border/70 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-foreground text-background">
                  <User className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground">
                    Atelier Member
                  </h3>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    member@atelier.studio
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    Membership Tier
                  </span>
                  <span className="rounded-full bg-muted px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-foreground">
                    Patron Circle
                  </span>
                </div>
                <div className="mt-2 text-xs text-foreground font-medium">
                  Complimentary worldwide priority delivery & lifetime complimentary repair service.
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card divide-y divide-border/60 text-xs">
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-2.5 text-muted-foreground">
                    <Package className="size-4 text-foreground" />
                    <span>Orders & Receipts</span>
                  </div>
                  <span className="font-mono text-muted-foreground">1 Active</span>
                </div>

                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-2.5 text-muted-foreground">
                    <Shield className="size-4 text-foreground" />
                    <span>Lifetime Guarantee Pass</span>
                  </div>
                  <span className="font-mono text-emerald-700">Active</span>
                </div>

                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-2.5 text-muted-foreground">
                    <Clock className="size-4 text-foreground" />
                    <span>Studio Appointments</span>
                  </div>
                  <span className="font-mono text-muted-foreground">London / Porto</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-md bg-foreground py-3 text-xs font-medium uppercase tracking-[0.14em] text-background transition-colors hover:bg-[#262624]"
            >
              Done
            </button>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}

export default AccountModal;
