import { 
  FacturaClient, 
  LivrareClient, 
  IncasareClient, 
  FacturaFurnizor, 
  ReceptieMaterial, 
  ContBancar, 
  MiscareBanca, 
  InregistrareCasa 
} from "./types";

export const facturiClienti: FacturaClient[] = [
  { id: 1, nr_factura: "FC-001", data: "2024-01-15", cod_comanda: "LIV-001", client: "STRABAG SRL", total_fara_tva: 15000, tva: 2850, total: 17850, data_scadenta: "2024-02-15", suma_incasata: 17850, suma_restanta: 0, status: "Încasată" },
  { id: 2, nr_factura: "FC-002", data: "2024-01-18", cod_comanda: "LIV-002", client: "PORR CONSTRUCT SRL", total_fara_tva: 28500, tva: 5415, total: 33915, data_scadenta: "2024-02-18", suma_incasata: 20000, suma_restanta: 13915, status: "Parțial" },
  { id: 3, nr_factura: "FC-003", data: "2024-01-22", cod_comanda: "LIV-003", client: "COLAS ROMANIA SA", total_fara_tva: 42000, tva: 7980, total: 49980, data_scadenta: "2024-02-22", suma_incasata: 0, suma_restanta: 49980, status: "Neîncasată" },
  { id: 4, nr_factura: "FC-004", data: "2024-01-25", cod_comanda: "LIV-004", client: "ROMSTRADE SRL", total_fara_tva: 18750, tva: 3562.5, total: 22312.5, data_scadenta: "2024-02-25", suma_incasata: 22312.5, suma_restanta: 0, status: "Încasată" },
  { id: 5, nr_factura: "FC-005", data: "2024-01-28", cod_comanda: "LIV-005", client: "EUROCONSTRUCT SA", total_fara_tva: 65000, tva: 12350, total: 77350, data_scadenta: "2024-02-28", suma_incasata: 0, suma_restanta: 77350, status: "Neîncasată" },
];

export const livrariClienti: LivrareClient[] = [
  { id: 1, data: "2024-01-15", cod: "LIV-001", cod_comanda: "CMD-001", nr_aviz: "AVZ-001", client: "STRABAG SRL", produs: "BA 16", cantitate: 120, valoare_produs: 12000, valoare_transport: 1500, total: 13500, status_facturare: "Facturat FC-001" },
  { id: 2, data: "2024-01-16", cod: "LIV-002", cod_comanda: "CMD-002", nr_aviz: "AVZ-002", client: "PORR CONSTRUCT SRL", produs: "BAD 22.4", cantitate: 85, valoare_produs: 9350, valoare_transport: 1200, total: 10550, status_facturare: "Facturat FC-002" },
  { id: 3, data: "2024-01-18", cod: "LIV-003", cod_comanda: "CMD-003", nr_aviz: "AVZ-003", client: "COLAS ROMANIA SA", produs: "BA 16", cantitate: 200, valoare_produs: 20000, valoare_transport: 2500, total: 22500, status_facturare: "Nefacturat" },
  { id: 4, data: "2024-01-20", cod: "LIV-004", cod_comanda: "CMD-004", nr_aviz: "AVZ-004", client: "ROMSTRADE SRL", produs: "BINDER", cantitate: 150, valoare_produs: 13500, valoare_transport: 1800, total: 15300, status_facturare: "Nefacturat" },
  { id: 5, data: "2024-01-22", cod: "LIV-005", cod_comanda: "CMD-005", nr_aviz: "AVZ-005", client: "EUROCONSTRUCT SA", produs: "BAD 22.4", cantitate: 300, valoare_produs: 33000, valoare_transport: 3600, total: 36600, status_facturare: "Nefacturat" },
];

export const incasariClienti: IncasareClient[] = [
  { id: 1, data: "2024-01-20", cod_comanda: "LIV-001", client: "STRABAG SRL", tip: "OP", suma_totala: 17850, suma_alocata: 17850, suma_nealocata: 0 },
  { id: 2, data: "2024-01-22", cod_comanda: "LIV-002", client: "PORR CONSTRUCT SRL", tip: "OP", suma_totala: 20000, suma_alocata: 20000, suma_nealocata: 0 },
  { id: 3, data: "2024-01-25", cod_comanda: "LIV-004", client: "ROMSTRADE SRL", tip: "OP", suma_totala: 22312.5, suma_alocata: 22312.5, suma_nealocata: 0 },
  { id: 4, data: "2024-01-28", cod_comanda: "LIV-003", client: "COLAS ROMANIA SA", tip: "Numerar", suma_totala: 5000, suma_alocata: 0, suma_nealocata: 5000 },
  { id: 5, data: "2024-01-30", cod_comanda: "LIV-005", client: "EUROCONSTRUCT SA", tip: "OP", suma_totala: 30000, suma_alocata: 0, suma_nealocata: 30000 },
];

export const facturiFurnizori: FacturaFurnizor[] = [
  { id: 1, nr_factura: "FF-2024-001", data: "2024-01-10", furnizor: "PETROM SA", total_fara_tva: 45000, tva: 8550, total: 53550, data_scadenta: "2024-02-10", suma_platita: 53550, suma_restanta: 0, status: "Plătită" },
  { id: 2, nr_factura: "FF-2024-002", data: "2024-01-12", furnizor: "CARIERE PIATRĂ SRL", total_fara_tva: 32000, tva: 6080, total: 38080, data_scadenta: "2024-02-12", suma_platita: 20000, suma_restanta: 18080, status: "Parțial" },
  { id: 3, nr_factura: "FF-2024-003", data: "2024-01-15", furnizor: "BITUM TRADE SA", total_fara_tva: 78000, tva: 14820, total: 92820, data_scadenta: "2024-02-15", suma_platita: 0, suma_restanta: 92820, status: "Neplătită" },
  { id: 4, nr_factura: "FF-2024-004", data: "2024-01-18", furnizor: "ENERGIE ELECTRICA SA", total_fara_tva: 12500, tva: 2375, total: 14875, data_scadenta: "2024-02-18", suma_platita: 14875, suma_restanta: 0, status: "Plătită" },
  { id: 5, nr_factura: "FF-2024-005", data: "2024-01-20", furnizor: "TRANSPORT AGREGATE SRL", total_fara_tva: 18000, tva: 3420, total: 21420, data_scadenta: "2024-02-20", suma_platita: 0, suma_restanta: 21420, status: "Neplătită" },
];

export const receptiiMateriale: ReceptieMaterial[] = [
  { id: 1, data: "2024-01-10", cod: "CMD-001", furnizor: "PETROM SA", material: "BITUM 50/70", cantitate_receptionata: 25, pret_material_total: 42500, pret_transport_total: 2500, pret_total: 45000, nr_factura: "FF-2024-001" },
  { id: 2, data: "2024-01-12", cod: "CMD-002", furnizor: "CARIERE PIATRĂ SRL", material: "4/8 CONC", cantitate_receptionata: 400, pret_material_total: 28000, pret_transport_total: 4000, pret_total: 32000, nr_factura: "FF-2024-002" },
  { id: 3, data: "2024-01-15", cod: "CMD-003", furnizor: "BITUM TRADE SA", material: "BITUM 50/70", cantitate_receptionata: 40, pret_material_total: 68000, pret_transport_total: 10000, pret_total: 78000, nr_factura: "" },
  { id: 4, data: "2024-01-18", cod: "CMD-004", furnizor: "CARIERE PIATRĂ SRL", material: "8/16 CONC", cantitate_receptionata: 350, pret_material_total: 31500, pret_transport_total: 3500, pret_total: 35000, nr_factura: "" },
  { id: 5, data: "2024-01-20", cod: "CMD-005", furnizor: "TRANSPORT AGREGATE SRL", material: "0/4 NAT", cantitate_receptionata: 500, pret_material_total: 15000, pret_transport_total: 3000, pret_total: 18000, nr_factura: "FF-2024-005" },
];

export const conturiBancare: ContBancar[] = [
  { id: 1, banca: "BCR", iban: "RO49RNCB0082044172950001", moneda: "RON", sold_curent: 285420.50 },
  { id: 2, banca: "BRD", iban: "RO62BRDE410SV12345678901", moneda: "RON", sold_curent: 142680.75 },
  { id: 3, banca: "ING Bank", iban: "RO15INGB0000999901234567", moneda: "EUR", sold_curent: 45230.00 },
  { id: 4, banca: "Raiffeisen", iban: "RO31RZBR0000060007891234", moneda: "RON", sold_curent: 98540.25 },
];

export const miscariBanca: MiscareBanca[] = [
  { id: 1, data: "2024-01-20", cont_bancar: "BCR - RON", tip: "Încasare", partener: "STRABAG SRL", suma: 17850, document_asociat: "FC-001" },
  { id: 2, data: "2024-01-21", cont_bancar: "BCR - RON", tip: "Plată", partener: "PETROM SA", suma: 53550, document_asociat: "FF-2024-001" },
  { id: 3, data: "2024-01-22", cont_bancar: "BRD - RON", tip: "Încasare", partener: "PORR CONSTRUCT SRL", suma: 20000, document_asociat: "FC-002" },
  { id: 4, data: "2024-01-23", cont_bancar: "BCR - RON", tip: "Plată", partener: "CARIERE PIATRĂ SRL", suma: 20000, document_asociat: "FF-2024-002" },
  { id: 5, data: "2024-01-25", cont_bancar: "Raiffeisen - RON", tip: "Încasare", partener: "ROMSTRADE SRL", suma: 22312.5, document_asociat: "FC-004" },
  { id: 6, data: "2024-01-26", cont_bancar: "BCR - RON", tip: "Plată", partener: "ENERGIE ELECTRICA SA", suma: 14875, document_asociat: "FF-2024-004" },
];

export const registruCasa: InregistrareCasa[] = [
  { id: 1, data: "2024-01-15", tip: "Încasare", partener: "CLIENT OCAZIONAL", suma: 2500, document_asociat: "Chitanță 001" },
  { id: 2, data: "2024-01-18", tip: "Plată", partener: "FURNIZOR LOCAL", suma: 1200, document_asociat: "Bon fiscal" },
  { id: 3, data: "2024-01-20", tip: "Încasare", partener: "COLAS ROMANIA SA", suma: 5000, document_asociat: "Chitanță 002" },
  { id: 4, data: "2024-01-22", tip: "Plată", partener: "SALARII ZILIERI", suma: 3500, document_asociat: "Stat plată" },
  { id: 5, data: "2024-01-25", tip: "Încasare", partener: "CLIENT RETAIL", suma: 1800, document_asociat: "Chitanță 003" },
];
