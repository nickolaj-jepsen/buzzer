import { PencilIcon, XMarkIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";

interface EditNameFormProps {
  onSubmit: (name: string) => void;
  onCancel: () => void;
  initialName?: string;
  className?: string;
}

export function EditNameForm({
  onSubmit,
  onCancel,
  initialName,
  className,
}: EditNameFormProps) {
  return (
    <form
      className={clsx("flex items-center space-x-2 w-full", className)}
      action={(formData) => {
        const input = formData.get("name") as string | null;
        if (input && input.trim() !== "") {
          onSubmit(input.trim());
        } else {
          onCancel();
        }
      }}
    >
      <label className="floating-label flex-1">
        <span className="label">Name</span>
        <input
          type="text"
          name="name"
          defaultValue={initialName}
          className="input input-bordered"
        />
      </label>
      <button type="submit" className="btn btn-success">
        <PencilIcon className="h-4 w-4" />
        Save
      </button>
      <button
        type="button"
        className="btn btn-outline"
        onClick={onCancel}
        title="Cancel Edit"
        aria-label="Cancel Edit"
      >
        <XMarkIcon className="h-4 w-4" />
      </button>
    </form>
  );
}
