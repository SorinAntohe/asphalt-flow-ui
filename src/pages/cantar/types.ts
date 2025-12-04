export type Direction = 'INBOUND' | 'OUTBOUND';
export type WeighStep = '1/2' | '2/2';

export interface WeighSession {
  id: string;
  sessionCode: string;
  direction: Direction;
  orderNo?: string; // for OUTBOUND
  poNo?: string; // for INBOUND
  rowId: string;
  nrAuto: string;
  step: WeighStep;
  tara?: number;
  masaBrut?: number;
  masaNet?: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  plantId: string;
  financeApproved?: boolean;
  toleranceExceeded?: boolean;
  tolerancePercent?: number;
}

export interface EligibleRow {
  id: string;
  produs: string;
  cantitate: number;
  hasTara: boolean;
  hasBrut: boolean;
  nrAuto?: string;
  isOnScale: boolean;
  onScaleSessionCode?: string;
}

export interface Plant {
  id: string;
  name: string;
}
