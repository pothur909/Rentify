"use client";

import { X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

type Props = {
  open: boolean;
  variant: "success" | "pending" | "error";
  title: string;
  message: string;
  onClose: () => void;
};

export default function StatusPopup({ open, variant, title, message, onClose }: Props) {
  if (!open) return null;

  const Icon =
    variant === "success" ? CheckCircle2 : variant === "error" ? AlertCircle : Loader2;

  const iconClass =
    variant === "success"
      ? "text-green-600"
      : variant === "error"
      ? "text-red-600"
      : "text-blue-600";

  const ringClass =
    variant === "success"
      ? "ring-green-200"
      : variant === "error"
      ? "ring-red-200"
      : "ring-blue-200";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={`relative w-full max-w-md rounded-2xl bg-white shadow-2xl ring-4 ${ringClass}`}>
        <div className="p-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <Icon className={`w-6 h-6 ${iconClass} ${variant === "pending" ? "animate-spin" : ""}`} />
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-bold text-gray-900">{title}</h3>
                <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <p className="mt-1 text-sm text-gray-600">{message}</p>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-black"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
