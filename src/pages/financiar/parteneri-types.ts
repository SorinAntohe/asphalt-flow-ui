// Client cu sold agregat
export interface ClientCuSold {
  id: number;
  nume: string;
  cui: string;
  adresa: string;
  sold_curent: number;
  zile_intarziere_max: number;
}

// Furnizor cu sold agregat
export interface FurnizorCuSold {
  id: number;
  nume: string;
  cui: string;
  adresa: string;
  sold_curent: number;
  zile_intarziere_max: number;
}

// Factură pentru istoric
export interface FacturaIstoric {
  id: number;
  nr_factura: string;
  data: string;
  data_scadenta: string;
  total: number;
  suma_achitata: number;
  suma_restanta: number;
  status: "Achitată" | "Parțial" | "Neachitată";
}

// Plată/Încasare pentru istoric
export interface PlataIstoric {
  id: number;
  data: string;
  tip: string;
  suma: number;
  document_referinta: string;
}

// Sold pe intervale
export interface SoldIntervale {
  interval_0_30: number;
  interval_30_60: number;
  interval_60_plus: number;
}

// Fișă partener completă
export interface FisaPartener {
  partener: ClientCuSold | FurnizorCuSold;
  facturi: FacturaIstoric[];
  plati: PlataIstoric[];
  sold_intervale: SoldIntervale;
}

// Scadențar entry
export interface ScadentarEntry {
  id: number;
  tip_partener: "Client" | "Furnizor";
  nume_partener: string;
  tip_document: "Factură client" | "Factură furnizor";
  numar_document: string;
  data_document: string;
  data_scadenta: string;
  suma_restanta: number;
  zile_intarziere: number;
  status: "La zi" | "Întârziat";
}
