import * as React from 'react'
import { DayPicker } from 'react-day-picker'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/shared/utils/cn'
import { buttonVariants } from '@/shared/ui/button'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        root: 'flex min-h-0 flex-1 flex-col',
        months: 'flex min-h-0 flex-1 flex-row gap-2 sm:gap-4',
        month: 'flex min-h-0 flex-1 flex-col gap-1 min-w-0',
        month_caption:
          'flex h-[40px] min-h-[40px] max-h-[40px] shrink-0 justify-center items-stretch relative p-0 box-border',
        month_grid:
          'mt-0 flex min-h-0 w-full flex-1 flex-col pt-3 border-collapse [border-spacing:0] [&_thead]:shrink-0 [&_tbody]:flex [&_tbody]:min-h-0 [&_tbody]:flex-1 [&_tbody]:flex-col',
        weeks: 'flex min-h-0 flex-1 flex-col gap-y-[3px] mt-3 content-start',
        nav: 'flex items-center gap-1',
        button_previous: cn(
          'absolute left-1',
          buttonVariants({ variant: 'outline' }),
          'size-8 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        button_next: cn(
          'absolute right-1',
          buttonVariants({ variant: 'outline' }),
          'size-8 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        caption_label:
          'flex min-h-full w-full items-center justify-center text-sm font-black leading-none tracking-widest -mt-[26px]',
        weekday:
          'text-muted-foreground flex flex-1 items-center justify-center font-normal text-[0.8rem]',
        weekdays: 'flex w-full',
        week: 'flex shrink-0 flex-row min-h-9 gap-0',

        // 单元格：relative 供 ::before 伪元素定位，不在此设置背景/圆角
        day: 'relative flex flex-1 items-center justify-center overflow-visible p-0 text-center text-sm w-full min-w-0',

        // 按钮：relative + z-[1] 确保浮在 ::before 伪元素之上
        day_button: cn(
          buttonVariants({ variant: 'ghost' }),
          'relative z-[1] flex h-9 w-9 min-h-9 min-w-9 max-h-9 max-w-9 shrink-0 items-center justify-center rounded-full p-0 font-normal aria-selected:opacity-100 aspect-square'
        ),

        // range 背景条通过 ::before 伪元素实现，与圆形端点无缝衔接：
        //   start → 只铺右半格（left-1/2 right-0），与下一格左对齐
        //   middle → 铺满整格
        //   end   → 只铺左半格（left-0 right-1/2），与上一格右对齐
        range_start: [
          'day-range_start',
          // 铺满整格，仅左侧边缘加半圆 → 药丸背景从 day1 左边缘开始
          "before:absolute before:inset-y-0 before:left-0 before:right-0 before:content-[''] before:bg-[#146CFF]/10 before:rounded-l-full",
          '[&_.day_button]:!bg-[#146CFF] [&_.day_button]:!text-white [&_.day_button:hover]:!bg-[#146CFF]',
        ].join(' '),
        range_middle: [
          'day-range_middle',
          // 整格铺满，无圆角
          "before:absolute before:inset-y-0 before:left-0 before:right-0 before:content-[''] before:bg-[#146CFF]/10",
          '[&_.day_button]:!bg-transparent [&_.day_button]:!text-foreground [&_.day_button:hover]:!bg-[#146CFF]/20',
        ].join(' '),
        range_end: [
          'day-range_end',
          // 铺满整格，仅右侧边缘加半圆 → 药丸背景到 day10 右边缘结束
          "before:absolute before:inset-y-0 before:left-0 before:right-0 before:content-[''] before:bg-[#146CFF]/10 before:rounded-r-full",
          '[&_.day_button]:!bg-[#146CFF] [&_.day_button]:!text-white [&_.day_button:hover]:!bg-[#146CFF]',
        ].join(' '),

        // selected 只对内部 day_button 生效（不污染 <td> 背景）
        // range_middle 会通过 !important 覆盖此处的 button 样式
        selected:
          '[&_.day_button]:bg-[#146CFF] [&_.day_button]:text-white [&_.day_button:hover]:bg-[#146CFF]',

        today: 'bg-accent text-accent-foreground',
        outside: 'day-outside text-muted-foreground opacity-50',
        disabled: 'text-muted-foreground opacity-50',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === 'left' ? (
            <ChevronLeft className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = 'Calendar'

export { Calendar }
