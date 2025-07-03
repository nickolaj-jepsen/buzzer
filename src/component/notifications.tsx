"use client";

import { XMarkIcon } from "@heroicons/react/16/solid";
import { clsx } from "clsx";
import toastManager, { ToastType, useToaster } from "react-hot-toast/headless";

const CLASS_MAP: Record<ToastType, string> = {
  success: "alert-success",
  error: "alert-error",
  loading: "alert-info",
  blank: "alert-info",
  custom: "alert-warning",
};

export const Notifications = () => {
  const { toasts, handlers } = useToaster();
  const { startPause, endPause } = handlers;
  console.debug("Notifications rendered", toasts);

  return (
    <div
      className="toast toast-center"
      onMouseEnter={startPause}
      onMouseLeave={endPause}
    >
      {toasts.map((toast) => {
        return (
          <div
            key={toast.id}
            className={clsx(
              "alert py-1 pl-4 pr-1",
              CLASS_MAP[toast.type],
              toast.className,
            )}
            style={toast.style}
            {...toast.ariaProps}
          >
            {toast.icon && <span className="shrink-0">{toast.icon}</span>}
            {typeof toast.message === "function"
              ? toast.message(toast)
              : toast.message}
            <button
              className="btn btn-ghost btn-sm btn-square"
              onClick={() => toastManager.remove(toast.id)}
            >
              <XMarkIcon className="size-[1.2em]" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
