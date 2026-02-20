import { NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import type { TopModule } from '@/types/nav'
import { cn } from "@/lib/utils"

interface TopNavProps {
  modules: TopModule[]
}

export default function TopNav({ modules }: TopNavProps) {
  return (
    <nav className="flex items-center gap-1">
      {modules.map((mod) => (
        <Button
          key={mod.id}
          variant="ghost"
          size="sm"
          asChild
          className="h-8 px-3"
        >
          <NavLink
            to={mod.path}
            end={mod.path === '/dashboard' || mod.path === '/settings'}
            className={({ isActive }) =>
              cn(
                'h-8 px-3 font-medium',
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
              )
            }
          >
            {mod.label}
          </NavLink>
        </Button>
      ))}
    </nav>
  )
}
