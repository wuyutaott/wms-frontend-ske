/** 顶部模块（一级横向导航） */
export interface TopModule {
  id: string
  label: string
  path: string
}

/** 侧边栏菜单项：可带子菜单 */
export interface SidebarItem {
  id: string
  label: string
  path: string
  icon?: string
  children?: SidebarItem[]
}

/** 按顶部模块 id 映射的侧边栏配置 */
export type SidebarConfigByModule = Record<string, SidebarItem[]>
