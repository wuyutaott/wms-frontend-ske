import TabsBar from './TabsBar'

interface TopBarProps {
  openTabs: string[]
  onCloseTab: (path: string) => void
  pathToLabel: Record<string, string>
}

export default function TopBar({ openTabs, onCloseTab, pathToLabel }: TopBarProps) {
  return (
    <header className="flex shrink-0 flex-col border-b border-sidebar-border bg-sidebar">
      <TabsBar openTabs={openTabs} onCloseTab={onCloseTab} pathToLabel={pathToLabel} />
    </header>
  )
}
