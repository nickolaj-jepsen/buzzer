"use client";

import { MinusIcon, PlusIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import { useState } from "react";

interface SpinnerInputProps {
  label: string;
  name?: string;
  defaultValue?: number;
  className?: string;
}

export const SpinnerInput = ({
  label,
  name,
  defaultValue,
  className,
}: SpinnerInputProps) => {
  const [value, setValue] = useState(defaultValue || 0);

  return (
    <div className={clsx(className, "join")}>
      <button
        className="btn btn-ghost btn-square join-item"
        onClick={(e) => {
          e.preventDefault();
          setValue((prev) => prev - 1);
        }}
      >
        <MinusIcon className="size-[1.2em]" />
      </button>
      <label className={"floating-label join-item"}>
        <span className="label">{label}</span>
        <input
          type="number"
          name={name}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="input input-bordered"
        />
      </label>
      <button
        className="btn btn-ghost btn-square join-item"
        onClick={(e) => {
          e.preventDefault();
          setValue((prev) => prev + 1);
        }}
      >
        <PlusIcon className="size-[1.2em]" />
      </button>
    </div>
  );
};
