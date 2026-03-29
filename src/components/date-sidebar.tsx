"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { AdPlaceholder } from "@/components/ad-placeholder";

interface YearGroup {
  year: number;
  months: string[];
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface DateSidebarProps {
  years: YearGroup[];
}

export function DateSidebar({ years }: DateSidebarProps) {
  const searchParams = useSearchParams();
  const activeYear = searchParams.get("year");
  const activeMonth = searchParams.get("month");

  return (
    <aside className="border-border flex w-60 shrink-0 flex-col gap-5 border-r px-6 py-8">
      <span className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
        Filter by Date
      </span>

      {years.map((group) => (
        <YearSection
          key={group.year}
          year={group.year}
          months={group.months}
          isActive={activeYear === String(group.year)}
          activeMonth={activeYear === String(group.year) ? activeMonth : null}
        />
      ))}

      <AdPlaceholder size="300x250" />
    </aside>
  );
}

function YearSection({
  year,
  months,
  isActive,
  activeMonth,
}: {
  year: number;
  months: string[];
  isActive: boolean;
  activeMonth: string | null;
}) {
  const [open, setOpen] = useState(isActive || false);

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={() => {
          setOpen((prev) => !prev);
        }}
        className="flex w-full items-center gap-2 text-left"
      >
        {open ? (
          <ChevronDown className="text-foreground h-4 w-4" />
        ) : (
          <ChevronRight className="text-foreground h-4 w-4" />
        )}
        <span className="text-foreground text-[15px] font-medium">{year}</span>
      </button>

      {open && months.length > 0 && (
        <div className="flex flex-col gap-1.5 pt-1 pl-6">
          {months.map((month) => {
            const monthIndex = MONTH_NAMES.indexOf(month) + 1;
            const isActiveMonth = activeMonth === String(monthIndex);

            return (
              <Link
                key={month}
                href={`/?year=${String(year)}&month=${String(monthIndex)}`}
                className={`text-sm ${isActiveMonth ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"}`}
              >
                {month}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
