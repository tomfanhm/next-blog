"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DateGroup {
  year: number;
  months: string[];
}

interface DateSidebarProps {
  dateGroups: DateGroup[];
  className?: string;
}

const MONTH_INDEX: Record<string, number> = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

export function DateSidebar({ dateGroups, className }: DateSidebarProps) {
  const searchParams = useSearchParams();
  const activeYear = searchParams.get("year");
  const activeMonth = searchParams.get("month");

  const [expandedYears, setExpandedYears] = useState<Set<number>>(
    () => new Set([dateGroups[0]?.year ?? new Date().getFullYear()]),
  );

  function toggleYear(year: number) {
    setExpandedYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) {
        next.delete(year);
      } else {
        next.add(year);
      }
      return next;
    });
  }

  return (
    <aside aria-label="Filter by date" className={cn("hidden w-48 shrink-0 lg:block", className)}>
      <h3 className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
        Filter by Date
      </h3>

      <div className="flex flex-col gap-1">
        {dateGroups.map((group) => {
          const isExpanded = expandedYears.has(group.year);
          const isYearActive = activeYear === String(group.year) && !activeMonth;

          return (
            <div key={group.year}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  toggleYear(group.year);
                }}
                aria-expanded={isExpanded}
                className={cn(
                  "h-auto w-full justify-start gap-1 px-0 py-1 text-sm font-medium",
                  isYearActive ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <ChevronRight
                  className={cn("size-3.5 transition-transform", isExpanded && "rotate-90")}
                />
                {group.year}
              </Button>

              {isExpanded && (
                <div className="ml-5 flex flex-col gap-0.5">
                  {group.months.map((month) => {
                    const monthNum = MONTH_INDEX[month];
                    const isMonthActive =
                      activeYear === String(group.year) && activeMonth === String(monthNum);

                    return (
                      <Link
                        key={month}
                        href={`/?year=${String(group.year)}&month=${String(monthNum)}`}
                        className={cn(
                          "py-0.5 text-left text-sm",
                          isMonthActive
                            ? "text-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {month}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {(activeYear ?? activeMonth) && (
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground mt-4 block text-xs underline"
        >
          Clear filters
        </Link>
      )}
    </aside>
  );
}
