export interface TransactionField {
  label: string
  value: string
}

export interface TransactionItem {
  id: string
  title: string
  code: string
  system: string
  tag: string
  scenario: string
  service: string
  description: string
  status: 'ready' | 'draft' | 'monitor'
  defaultFields: TransactionField[]
}

export interface TransactionCategory {
  id: string
  title: string
  subtitle: string
  items: TransactionItem[]
}

export interface TransactionGroup {
  id: string
  title: string
  subtitle: string
  children: TransactionCategory[]
}

