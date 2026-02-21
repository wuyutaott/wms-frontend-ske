/** 侧边栏菜单项：可带子菜单 */
export interface SidebarItem {
  id: string
  label: string
  path: string
  icon?: string
  children?: SidebarItem[]
}
