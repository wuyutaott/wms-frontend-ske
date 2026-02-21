import { cn } from '@/shared/utils/cn'

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
  return (
    <div className="space-y-6">
      <div className="flex w-full gap-4 overflow-x-auto pb-1">
        {PANELS.map((panel) => (
          <StatCard key={panel.title} title={panel.title} items={panel.items} />
        ))}
      </div>
    </div>
  )
}
