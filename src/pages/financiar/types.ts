// Facturi Clienti
export interface FacturaClient {
  id: number;
  nr_factura: string;
  data: string;
  cod_comanda?: string;
  client: string;
  total_fara_tva: number;
  tva: number;
  total: number;
  data_scadenta: string;
  suma_incasata: number;
  suma_restanta: number;
  status: "Neîncasată" | "Parțial" | "Încasată";
}

// Livrari Produs Finit
export interface LivrareClient {
  id: number;
  data: string;
  cod: string;
  cod_comanda?: string;
  nr_aviz: string;
  client: string;
  produs: string;
  cantitate: number;
  valoare_produs: number;
  valoare_transport: number;
  total: number;
  status_facturare: string;
}

// Incasari Clienti
export interface IncasareClient {
  id: number;
  data: string;
  cod_comanda?: string;
  client: string;
  tip: "OP" | "Numerar" | "Card" | "CEC";
  suma_totala: number;
  suma_alocata: number;
  suma_nealocata: number;
}

// Facturi Furnizori
export interface FacturaFurnizor {
  id: number;
  nr_factura: string;
  data: string;
  furnizor: string;
  total_fara_tva: number;
  tva: number;
  total: number;
  data_scadenta: string;
  suma_platita: number;
  suma_restanta: number;
  status: "Neplătită" | "Parțial" | "Plătită";
}

// Receptii Materiale
export interface ReceptieMaterial {
  id: number;
  data: string;
  cod: string;
  furnizor: string;
  material: string;
  cantitate_receptionata: number;
  pret_material_total: number;
  pret_transport_total: number;
  pret_total: number;
  nr_factura: string;
}

// Conturi Bancare
export interface ContBancar {
  id: number;
  banca: string;
  iban: string;
  moneda: "RON" | "EUR" | "USD";
  sold_curent: number;
}

// Miscari Banca
export interface MiscareBanca {
  id: number;
  data: string;
  cont_bancar: string;
  tip: "Încasare" | "Plată";
  partener: string;
  suma: number;
  document_asociat: string;
}

// Registru Casa
export interface InregistrareCasa {
  id: number;
  data: string;
  tip: "Încasare" | "Plată";
  partener: string;
  suma: number;
  document_asociat: string;
}
