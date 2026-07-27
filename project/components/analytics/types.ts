export interface ProjectMetric {
  id: string
  name: string
  totalTasks: number
  completedTasks: number
  completionRate: number
}

export interface ActivityLogItem {
  id: string
  action: string
  entityType?: string | null
  entityName: string
  details?: string | null
  createdAt: Date
}