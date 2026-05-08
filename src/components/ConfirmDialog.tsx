import { Button } from "./Button";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancelar",
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="gm-panel-elevated w-full max-w-md rounded-lg p-5"
      >
        <h2
          id="confirm-title"
          className="text-lg font-semibold tracking-tight text-[var(--text-primary)]"
        >
          {title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
          {description}
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <Button variant="subtle" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
