export interface ReplicateAll {
  currentMonth:  number;
  currentYear:   number;
  previousMonth: number;
  previousYear:  number;
  userId:        number;
}

export interface ReplicateOnly {
  currentMonth:  number;
  currentYear:   number;
  previousMonth: number;
  previousYear:  number;
  userId:        number;
  items:         ItemPresupuesto[];
}

interface ItemPresupuesto {
  itemId: number;
  spendType: number
}