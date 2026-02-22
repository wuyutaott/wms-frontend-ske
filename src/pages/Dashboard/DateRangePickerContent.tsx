import { useCallback } from 'react'
import {
  format,
  subDays,
  subMonths,
  addMonths,
  addYears,
  subYears,
  startOfMonth,
  endOfMonth,
  startOfDay,
} from 'date-fns'
import { zhCN as dateFnsZhCN } from 'date-fns/locale'
import { zhCN as dayPickerZhCN } from 'react-day-picker/locale'
import {
  Calendar as CalendarIcon,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { Button } from '@/shared/ui/button'
import { Calendar } from '@/shared/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/ui/popover'
import { cn } from '@/shared/utils/cn'

export const defaultDateRange: DateRange = {
  from: new Date(2026, 0, 22),
  to: new Date(2026, 1, 20),
}

/** 快捷日期范围选项 */
export const QUICK_RANGES = [
  { label: '最近7天', getValue: () => ({ from: startOfDay(subDays(new Date(), 6)), to: new Date() }) },
  { label: '最近14天', getValue: () => ({ from: startOfDay(subDays(new Date(), 13)), to: new Date() }) },
  { label: '最近30天', getValue: () => ({ from: startOfDay(subDays(new Date(), 29)), to: new Date() }) },
  { label: '本月', getValue: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }) },
  { label: '上月', getValue: () => ({ from: startOfMonth(subMonths(new Date(), 1)), to: endOfMonth(subMonths(new Date(), 1)) }) },
  { label: '近半年', getValue: () => ({ from: startOfDay(subMonths(new Date(), 6)), to: new Date() }) },
] as const

export interface SharedDateRangePickerProps {
  dateRange: DateRange | undefined
  onDateRangeChange: (range: DateRange | undefined) => void
  displayMonth: Date
  onDisplayMonthChange: (month: Date) => void
  triggerClassName?: string
  placeholder?: string
}

/** 与单量分析一致的日期区间选择器（触发器 + 弹层内容），供单量分析、业务费用等共用 */
export function SharedDateRangePicker({
  dateRange,
  onDateRangeChange,
  displayMonth,
  onDisplayMonthChange,
  triggerClassName,
  placeholder = '选择开始与结束日期',
}: SharedDateRangePickerProps) {
  const handleRangeSelect = useCallback(
    (range: DateRange | undefined, selectedDay: Date) => {
      if (dateRange?.from && dateRange?.to) {
        onDateRangeChange({ from: selectedDay, to: undefined })
      } else {
        onDateRangeChange(range)
      }
    },
    [dateRange, onDateRangeChange]
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'min-w-[240px] justify-start text-left font-normal',
            !dateRange?.from && 'text-muted-foreground',
            triggerClassName
          )}
        >
          <CalendarIcon className="mr-2 size-4 shrink-0" />
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, 'yyyy-MM-dd', { locale: dateFnsZhCN })} →{' '}
                {format(dateRange.to, 'yyyy-MM-dd', { locale: dateFnsZhCN })}
              </>
            ) : (
              format(dateRange.from, 'yyyy-MM-dd', { locale: dateFnsZhCN })
            )
          ) : (
            placeholder
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        align="end"
        sideOffset={8}
        style={{ width: 756, height: 343 }}
      >
        <div className="flex h-full w-full">
          <div className="flex w-[120px] shrink-0 flex-col border-r border-border py-3">
            {QUICK_RANGES.map(({ label, getValue }) => (
              <button
                key={label}
                type="button"
                className="min-w-[100px] px-4 py-2 text-left text-sm text-foreground hover:bg-muted/60"
                onClick={() => {
                  const { from, to } = getValue()
                  onDateRangeChange({ from, to })
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="relative flex min-h-0 flex-1 flex-col pt-[2px] px-2 pb-3">
            <div className="flex h-[40px] shrink-0 items-center justify-between gap-2">
              <div className="flex items-center gap-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0"
                  aria-label="上一年"
                  onClick={() => onDisplayMonthChange(subYears(displayMonth, 1))}
                >
                  <ChevronsLeft className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0"
                  aria-label="上个月"
                  onClick={() => onDisplayMonthChange(subMonths(displayMonth, 1))}
                >
                  <ChevronLeft className="size-4" />
                </Button>
              </div>
              <div
                className="grid flex-1 grid-cols-2 items-center text-sm font-black leading-none tracking-widest text-foreground"
                aria-hidden
              >
                <span className="flex justify-center -translate-x-[38px]">
                  {format(displayMonth, 'yyyy年M月', { locale: dateFnsZhCN })}
                </span>
                <span className="flex justify-center translate-x-[38px]">
                  {format(addMonths(displayMonth, 1), 'yyyy年M月', { locale: dateFnsZhCN })}
                </span>
              </div>
              <div className="flex items-center gap-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0"
                  aria-label="下个月"
                  onClick={() => onDisplayMonthChange(addMonths(displayMonth, 1))}
                >
                  <ChevronRight className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0"
                  aria-label="下一年"
                  onClick={() => onDisplayMonthChange(addYears(displayMonth, 1))}
                >
                  <ChevronsRight className="size-4" />
                </Button>
              </div>
            </div>
            <div className="absolute left-0 right-0 top-[42px] z-10 h-px bg-border" aria-hidden />
            <Calendar
              className="h-full min-h-0 w-full flex-1 flex flex-col px-2"
              mode="range"
              month={displayMonth}
              onMonthChange={(m) => m && onDisplayMonthChange(m)}
              selected={dateRange}
              onSelect={handleRangeSelect}
              numberOfMonths={2}
              fixedWeeks
              locale={dayPickerZhCN}
              hideNavigation
              classNames={{ month_caption: 'hidden' }}
              formatters={{
                formatMonthCaption: (month) =>
                  format(month, 'yyyy年M月', { locale: dateFnsZhCN }),
              }}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
