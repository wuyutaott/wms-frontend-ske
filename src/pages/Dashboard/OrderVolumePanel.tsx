import { useState } from 'react'
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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  Info,
  RefreshCw,
  Download,
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
import {
  Tooltip as TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/shared/ui/tooltip'
import { cn } from '@/shared/utils/cn'

const METRICS = [
  {
    name: '常规入库',
    value: 22,
    mom: -8.33,
    yoy: 29.41,
  },
  {
    name: '备货中转入库',
    value: 0,
    mom: -100,
    yoy: 0,
  },
  {
    name: '一件代发',
    value: 5510,
    mom: -0.16,
    yoy: 77.28,
  },
  {
    name: '备货中转',
    value: 6,
    mom: 50,
    yoy: 500,
  },
  {
    name: '换标服务',
    value: 0,
    mom: 0,
    yoy: 0,
  },
  {
    name: '次品处理',
    value: 0,
    mom: 0,
    yoy: 0,
  },
]

const DATES = [
  '2026-01-25', '2026-01-26', '2026-01-27', '2026-01-28', '2026-01-29', '2026-01-30', '2026-01-31',
  '2026-02-01', '2026-02-02', '2026-02-03', '2026-02-04', '2026-02-05', '2026-02-06', '2026-02-07',
  '2026-02-08', '2026-02-09', '2026-02-10',
]

/** 每个指标对应的图表趋势数据（测试用：不同指标不同走势） */
const CHART_DATA_BY_METRIC: Record<string, { date: string; value: number }[]> = {
  '常规入库': DATES.map((date, i) => ({ date, value: [1, 2, 4, 3, 5, 4, 3, 4, 5, 2, 3, 1, 2, 3, 2, 2, 1][i] })),
  '备货中转入库': DATES.map((date, i) => ({ date, value: [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0][i] })),
  '一件代发': DATES.map((date, i) => ({ date, value: [3, 4, 5, 5, 4, 4, 5, 5, 4, 3, 4, 3, 4, 4, 3, 3, 4][i] })),
  '备货中转': DATES.map((date, i) => ({ date, value: [1, 1, 2, 2, 3, 2, 3, 4, 5, 2, 3, 2, 3, 4, 2, 2, 1][i] })),
  '换标服务': DATES.map((date) => ({ date, value: 0 })),
  '次品处理': DATES.map((date, i) => ({ date, value: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0][i] })),
}

/** 每个指标对应的颜色（卡片选中框 + 图表曲线一致） */
const METRIC_COLORS: Record<string, string> = {
  '常规入库': '#3b82f6',
  '备货中转入库': '#f97316',
  '一件代发': '#22c55e',
  '备货中转': '#8b5cf6',
  '换标服务': '#06b6d4',
  '次品处理': '#ef4444',
}

/** X 轴刻度：上方月-日，下方星期（一、二…日）；六、日用圆角橙框标出 */
function XAxisTick({
  x,
  y,
  payload,
}: {
  x?: number | string
  y?: number | string
  payload?: { value?: string }
}) {
  const value = payload?.value
  if (!value) return null
  const nx = Number(x)
  const ny = Number(y)
  if (Number.isNaN(nx) || Number.isNaN(ny)) return null
  const d = new Date(value)
  const weekNames = ['日', '一', '二', '三', '四', '五', '六']
  const week = weekNames[d.getDay()]
  const isWeekend = week === '六' || week === '日'
  const dateStr = value.slice(5) // MM-DD，不含年
  // 所有星期 label 统一用 dy=24，保证 Y 轴对齐
  const weekLabelY = 24
  const boxW = 16
  const boxH = 14
  const boxX = -boxW / 2
  const boxY = 13 // 框包住文字（fontSize 12，baseline 24 时文字约在 12～24）
  return (
    <g transform={`translate(${nx},${ny})`}>
      <text x={0} y={0} dy={10} textAnchor="middle" fill="#666" fontSize={12}>
        {dateStr}
      </text>
      {isWeekend && (
        <rect
          x={boxX}
          y={boxY}
          width={boxW}
          height={boxH}
          rx={4}
          ry={4}
          fill="#fff7ed"
          stroke="#f97316"
          strokeWidth={1}
        />
      )}
      <text
        x={0}
        y={0}
        dy={weekLabelY}
        textAnchor="middle"
        fill={isWeekend ? '#c2410c' : '#999'}
        fontSize={12}
      >
        {week}
      </text>
    </g>
  )
}

function TrendArrow({ value }: { value: number }) {
  if (value === 0) return null
  const up = value > 0
  return (
    <span
      className={cn(
        'inline-flex items-center',
        up ? 'text-red-600' : 'text-green-600'
      )}
    >
      {up ? '↑' : '↓'}
    </span>
  )
}

function MetricCard({
  name,
  value,
  mom,
  yoy,
  selected,
  accentColor,
  onClick,
}: {
  name: string
  value: number
  mom: number
  yoy: number
  selected?: boolean
  accentColor?: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-36 shrink-0 flex-col rounded-lg border px-4 py-3 text-left shadow-sm transition-colors',
        'hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        !selected && 'border-border bg-white'
      )}
      style={
        selected && accentColor
          ? {
              borderColor: accentColor,
              backgroundColor: `${accentColor}0d`,
              boxShadow: `0 0 0 1px ${accentColor}40`,
            }
          : undefined
      }
    >
      <div className="text-sm text-muted-foreground">{name}</div>
      <div
        className={cn(
          'mt-1 text-xl font-bold tabular-nums',
          value === 0 ? 'text-gray-400' : 'text-foreground'
        )}
      >
        {value}
      </div>
      <div className="mt-2 flex flex-col gap-y-0.5 text-xs text-muted-foreground">
        <span>
          环比{' '}
          <span className={cn(mom > 0 ? 'text-red-600' : mom < 0 ? 'text-green-600' : '')}>
            {mom > 0 || mom < 0 ? `${mom > 0 ? '+' : ''}${mom.toFixed(2)}%` : '0.00%'}
          </span>
          <TrendArrow value={mom} />
        </span>
        <span>
          同比{' '}
          <span className={cn(yoy > 0 ? 'text-red-600' : yoy < 0 ? 'text-green-600' : '')}>
            {yoy > 0 || yoy < 0 ? `${yoy > 0 ? '+' : ''}${yoy.toFixed(2)}%` : '0.00%'}
          </span>
          <TrendArrow value={yoy} />
        </span>
      </div>
    </button>
  )
}

const defaultRange: DateRange = {
  from: new Date(2026, 0, 22),
  to: new Date(2026, 1, 20),
}

/** 快捷日期范围选项 */
const QUICK_RANGES = [
  { label: '最近7天', getValue: () => ({ from: startOfDay(subDays(new Date(), 6)), to: new Date() }) },
  { label: '最近14天', getValue: () => ({ from: startOfDay(subDays(new Date(), 13)), to: new Date() }) },
  { label: '最近30天', getValue: () => ({ from: startOfDay(subDays(new Date(), 29)), to: new Date() }) },
  { label: '本月', getValue: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }) },
  { label: '上月', getValue: () => ({ from: startOfMonth(subMonths(new Date(), 1)), to: endOfMonth(subMonths(new Date(), 1)) }) },
  { label: '近半年', getValue: () => ({ from: startOfDay(subMonths(new Date(), 6)), to: new Date() }) },
] as const

export function OrderVolumePanel() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(defaultRange)
  const [selectedMetric, setSelectedMetric] = useState('一件代发')
  const [displayMonth, setDisplayMonth] = useState(() =>
    startOfMonth(defaultRange.from ?? new Date())
  )
  const chartData = CHART_DATA_BY_METRIC[selectedMetric] ?? CHART_DATA_BY_METRIC[METRICS[0].name]
  const yMax = Math.max(5, ...chartData.map((d) => d.value))

  return (
    <TooltipProvider>
      <div className="rounded-lg border border-border bg-white p-4 shadow-sm">
        {/* 标题行 */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">单量分析</h2>
            <TooltipRoot>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="inline-flex size-5 items-center justify-center rounded-full border border-border bg-muted/50 text-muted-foreground hover:bg-muted"
                  aria-label="说明"
                >
                  <Info className="size-3" />
                </button>
              </TooltipTrigger>
              <TooltipContent>单量分析说明</TooltipContent>
            </TooltipRoot>
          </div>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'min-w-[240px] justify-start text-left font-normal',
                    !dateRange?.from && 'text-muted-foreground'
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
                    '选择开始与结束日期'
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
                  {/* 左侧快捷选项：宽度 120px，右边竖线即定位在 120 */}
                  <div className="flex w-[120px] shrink-0 flex-col border-r border-border py-3">
                    {QUICK_RANGES.map(({ label, getValue }) => (
                      <button
                        key={label}
                        type="button"
                        className="min-w-[100px] px-4 py-2 text-left text-sm text-foreground hover:bg-muted/60"
                        onClick={() => {
                          const { from, to } = getValue()
                          setDateRange({ from, to })
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  {/* 右侧双月日历：自定义标题行（上一年/上个月/下个月/下一年）+ 双月网格 */}
                  <div className="relative flex min-h-0 flex-1 flex-col pt-[2px] px-2 pb-3">
                    {/* 自定义日期导航：左 [上一年][上个月] 中 [月份] 右 [下个月][下一年] */}
                    <div className="flex h-[40px] shrink-0 items-center justify-between gap-2">
                      <div className="flex items-center gap-0.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8 shrink-0"
                          aria-label="上一年"
                          onClick={() =>
                            setDisplayMonth((m) => subYears(m, 1))
                          }
                        >
                          <ChevronsLeft className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8 shrink-0"
                          aria-label="上个月"
                          onClick={() =>
                            setDisplayMonth((m) => subMonths(m, 1))
                          }
                        >
                          <ChevronLeft className="size-4" />
                        </Button>
                      </div>
                      <div
                        className="grid flex-1 grid-cols-2 items-center text-sm font-black leading-none tracking-widest text-foreground"
                        aria-hidden
                      >
                        <span className="flex justify-center -translate-x-[38px]">
                          {format(displayMonth, 'yyyy年M月', {
                            locale: dateFnsZhCN,
                          })}
                        </span>
                        <span className="flex justify-center translate-x-[38px]">
                          {format(addMonths(displayMonth, 1), 'yyyy年M月', {
                            locale: dateFnsZhCN,
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8 shrink-0"
                          aria-label="下个月"
                          onClick={() =>
                            setDisplayMonth((m) => addMonths(m, 1))
                          }
                        >
                          <ChevronRight className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8 shrink-0"
                          aria-label="下一年"
                          onClick={() =>
                            setDisplayMonth((m) => addYears(m, 1))
                          }
                        >
                          <ChevronsRight className="size-4" />
                        </Button>
                      </div>
                    </div>
                    <div
                      className="absolute left-0 right-0 top-[42px] z-10 h-px bg-border"
                      aria-hidden
                    />
                    <Calendar
                      className="h-full min-h-0 w-full flex-1 flex flex-col px-2"
                      mode="range"
                      month={displayMonth}
                      onMonthChange={(m) => m && setDisplayMonth(m)}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                      fixedWeeks
                      locale={dayPickerZhCN}
                      hideNavigation
                      classNames={{
                        month_caption: 'hidden',
                      }}
                      formatters={{
                        formatMonthCaption: (month) =>
                          format(month, 'yyyy年M月', { locale: dateFnsZhCN }),
                      }}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon-sm" aria-label="刷新">
                <RefreshCw className="size-4" />
              </Button>
              <Button variant="ghost" size="icon-sm" aria-label="导出">
                <Download className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* 指标卡片：固定宽度、左对齐，点击切换图表曲线 */}
        <div className="mb-4 flex flex-wrap justify-start gap-3">
          {METRICS.map((m) => (
            <MetricCard
              key={m.name}
              name={m.name}
              value={m.value}
              mom={m.mom}
              yoy={m.yoy}
              selected={selectedMetric === m.name}
              accentColor={METRIC_COLORS[m.name]}
              onClick={() => setSelectedMetric(m.name)}
            />
          ))}
        </div>

        {/* 折线图：不可聚焦、不显示焦点框，避免出现蓝色边框 */}
        <div
          className="h-64 w-full min-h-[200px] outline-none [&_*]:outline-none [&_*]:focus:outline-none [&_*]:focus-visible:outline-none [&_*]:focus-visible:ring-0"
          style={{ width: '100%' }}
          tabIndex={-1}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 8, right: 8, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214.3 31.8% 91.4%)" />
              <XAxis
                dataKey="date"
                tick={(props) => <XAxisTick {...props} />}
                interval={0}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                domain={[0, yMax]}
                allowDecimals={false}
                width={24}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  fontSize: '12px',
                }}
                labelFormatter={(v) => v}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={METRIC_COLORS[selectedMetric] ?? '#8884d8'}
                strokeWidth={2}
                dot={{ r: 3, fill: METRIC_COLORS[selectedMetric] ?? '#8884d8' }}
                activeDot={{ r: 4, fill: METRIC_COLORS[selectedMetric] ?? '#8884d8' }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </TooltipProvider>
  )
}
