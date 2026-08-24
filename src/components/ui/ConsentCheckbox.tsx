"use client";

import Link from "next/link";

type ConsentCheckboxProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  id: string;
};

export function ConsentCheckbox({
  checked,
  onChange,
  id,
}: ConsentCheckboxProps) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-2.5">
      <input
        id={id}
        type="checkbox"
        required
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[#3d2418]"
      />
      <span className="text-[11px] leading-relaxed text-graphite/55">
        Соглашаюсь на{" "}
        <Link href="/privacy" className="text-brass underline-offset-2 hover:underline">
          обработку персональных данных
        </Link>
      </span>
    </label>
  );
}
