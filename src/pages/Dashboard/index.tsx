import { useState } from 'react'
import { startOfMonth } from 'date-fns'
import { cn } from '@/shared/utils/cn'
import { OrderVolumePanel } from './OrderVolumePanel'
import { defaultDateRange } from './DateRangePickerContent'
import { SharedDateRangePicker } from './DateRangePickerContent'
import type { DateRange } from 'react-day-picker'
const BUSINESS_EXPENSES_TOTAL = 3132.14
const BUSINESS_EXPENSES_ITEMS = [
  { name: '出库', amount: 1780.28, pct: 57 },
  { name: '仓租', amount: 1351.86, pct: 43 },
  { name: '入库', amount: 0, pct: 0 },
  { name: '工单', amount: 0, pct: 0 },
  { name: '其他', amount: 0, pct: 0 },
] as const

const PANELS = [
  { title: '入库', items: [{ subtitle: '待入库', value: 43 }] },
  {
    title: '出库',
    items: [
      { subtitle: '一件代发', value: 91 },
      { subtitle: '备货中转', value: 0 },
    ],
  },
  { title: '截单', items: [{ subtitle: '待处理', value: 0 }] },
  { title: '退件', items: [{ subtitle: '待入库', value: 20 }] },
  { title: '转运', items: [{ subtitle: '待收货', value: 0 }] },
  { title: '工单', items: [{ subtitle: '待审核', value: 0 }] },
  { title: 'FBA退货', items: [{ subtitle: '待入库', value: 5 }] },
]

const INVENTORY_TOTAL = 45_291
const INVENTORY_BREAKDOWN = [
  { label: '产品库存', value: 44_836, fillFull: false },
  { label: '箱库存', value: 82, fillFull: true },
  { label: '退货库存', value: 373, fillFull: true },
] as const

function InventoryPanel() {
  return (
    <div
      className="flex min-h-[400px] min-w-0 flex-1 flex-col rounded-lg border border-border bg-white p-4 shadow-sm"
      style={{ height: 400 }}
    >
      <h2 className="text-lg font-semibold text-foreground">库存</h2>

      <div className="mt-4 flex gap-8">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">在库总数</span>
          <span className="mt-0.5 text-2xl font-bold tabular-nums text-foreground">
            {INVENTORY_TOTAL.toLocaleString()}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">可用SKU</span>
          <span className="mt-0.5 text-2xl font-bold tabular-nums text-foreground">
            435
          </span>
        </div>
      </div>

      <div className="mt-6 flex flex-1 flex-col gap-4">
        {INVENTORY_BREAKDOWN.map(({ label, value, fillFull }) => (
          <div key={label} className="flex min-w-0 items-center gap-2">
            <span className="w-16 shrink-0 text-sm text-foreground">
              {label}
            </span>
            <div className="min-w-0 flex-1 overflow-hidden rounded-md bg-muted">
              <div
                className="h-4 rounded-md bg-[#3BB165]"
                style={{
                  width: fillFull
                    ? '100%'
                    : `${Math.min(100, (value / INVENTORY_TOTAL) * 100)}%`,
                }}
              />
            </div>
            <span className="w-14 shrink-0 text-right text-sm font-medium tabular-nums text-foreground">
              {value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className="size-3 shrink-0 rounded-sm bg-[#3BB165]" aria-hidden />
        在库
      </div>
    </div>
  )
}

export interface BusinessExpensesPanelProps {
  dateRange: DateRange | undefined
  onDateRangeChange: (range: DateRange | undefined) => void
  displayMonth: Date
  onDisplayMonthChange: (month: Date) => void
}

function BusinessExpensesPanel({
  dateRange,
  onDateRangeChange,
  displayMonth,
  onDisplayMonthChange,
}: BusinessExpensesPanelProps) {
  return (
    <div
      className="flex min-h-[400px] min-w-0 flex-1 flex-col rounded-lg border border-border bg-white p-4 shadow-sm"
      style={{ height: 400 }}
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground">业务费用</h2>
        <SharedDateRangePicker
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
          displayMonth={displayMonth}
          onDisplayMonthChange={onDisplayMonthChange}
          triggerClassName="min-w-[220px]"
          placeholder="选择日期"
        />
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-3 rounded-md border border-gray-200 p-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tabular-nums text-foreground">
            {BUSINESS_EXPENSES_TOTAL.toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })}
          </span>
          <span className="rounded bg-blue-600 px-1.5 py-0.5 text-xs font-medium text-white">
            USD
          </span>
        </div>

        <div className="flex gap-4 text-sm text-foreground">
          <span>
            同比 <span className="text-green-600">↑</span> 52%
          </span>
          <span>
            环比 <span className="text-red-600">↓</span> 25%
          </span>
        </div>

        <div className="flex flex-1 flex-col">
          {BUSINESS_EXPENSES_ITEMS.map(({ name, amount, pct }, index) => (
            <div key={name}>
              {index > 0 && (
                <div className="my-2 border-t border-gray-200" aria-hidden />
              )}
              <div className="flex items-center justify-between gap-4 py-1 text-sm">
                <span className="w-12 shrink-0 text-foreground">{name}</span>
                <span className="min-w-0 flex-1 text-right tabular-nums text-foreground">
                  ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <span className="w-10 shrink-0 text-right text-muted-foreground">
                  {pct}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  items,
}: {
  title: string
  items: { subtitle: string; value: number }[]
}) {
  const flexBasis = items.length

  return (
    <div
      className="flex min-w-0 flex-col rounded-lg border border-border bg-white px-4 py-3 shadow-sm"
      style={{ flex: flexBasis }}
    >
      <div className="text-sm font-bold text-foreground">{title}</div>
      <div
        className={cn(
          'mt-2 flex',
          items.length > 1 ? 'flex-row' : 'flex-col gap-0'
        )}
      >
        {items.map(({ subtitle, value }) => (
          <div
            key={subtitle}
            className={cn(
              'flex flex-col gap-0.5 text-left',
              items.length > 1 && 'min-w-0 flex-1 items-start'
            )}
          >
            <span className="text-xs text-muted-foreground">{subtitle}</span>
            <span
              className={cn(
                'text-lg font-extrabold tabular-nums',
                value === 0 ? 'text-gray-400' : 'text-foreground'
              )}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    defaultDateRange
  )
  const [displayMonth, setDisplayMonth] = useState(() =>
    startOfMonth(defaultDateRange.from ?? new Date())
  )

  return (
    <div className="space-y-6">
      <div className="flex w-full gap-4 overflow-x-auto pb-1">
        {PANELS.map((panel) => (
          <StatCard key={panel.title} title={panel.title} items={panel.items} />
        ))}
      </div>

      <OrderVolumePanel
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        displayMonth={displayMonth}
        onDisplayMonthChange={setDisplayMonth}
      />

      <div className="flex w-full gap-4">
        {/* 最新公告 */}
        <div
          className="min-h-[400px] flex-1 rounded-lg border border-border bg-white p-4 shadow-sm"
          style={{ height: 400 }}
        >
          <h2 className="text-lg font-semibold text-foreground">最新公告</h2>
          <div className="mt-3 text-sm text-muted-foreground">暂无内容</div>
        </div>

        {/* 库存 */}
        <InventoryPanel />

        {/* 业务费用 */}
        <BusinessExpensesPanel
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          displayMonth={displayMonth}
          onDisplayMonthChange={setDisplayMonth}
        />
      </div>
    </div>
  )
}
