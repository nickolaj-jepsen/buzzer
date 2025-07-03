"use client";

import { ClipboardIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import toast from "react-hot-toast/headless";

interface CopyFieldProps {
  value: string;
  className?: string;
}

export function CopyField({ value, className }: CopyFieldProps) {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <div className={clsx("join", className)}>
      <input className="input join-item grow" readOnly value={value} />
      <button className="btn btn-primary join-item" onClick={copyToClipboard}>
        Copy
        <ClipboardIcon className="size-[1.2em]" />
      </button>
    </div>
  );
}
