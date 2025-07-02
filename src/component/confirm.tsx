"use client";

import { PropsWithChildren, useRef } from "react";
import { createCallable } from "react-call";

interface ConfirmProps {
  message: string;
}
type Response = boolean;

export const Confirm = createCallable<ConfirmProps, Response>(
  ({ call, message }) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    // Close when clicking outside the modal-box
    const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) {
        call.end(false);
      }
    };

    return (
      <dialog
        ref={dialogRef}
        className="modal modal-open"
        onClick={handleDialogClick}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">{message}</h3>
          <div className="modal-action">
            <button className="btn" onClick={() => call.end(false)}>
              No
            </button>
            <button className="btn btn-primary" onClick={() => call.end(true)}>
              Yes
            </button>
          </div>
        </div>
      </dialog>
    );
  },
);

// Workaround for Confirm.Root not being a client component
export const ConfirmRoot = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Confirm.Root />
      {children}
    </>
  );
};
