import { ClientCuSold, FurnizorCuSold, FacturaIstoric, PlataIstoric, SoldIntervale, ScadentarEntry } from "./parteneri-types";

export const clientiCuSold: ClientCuSold[] = [
  { id: 1, nume: "STRABAG SRL", cui: "RO12345678", adresa: "Str. Constructorilor 15, București", sold_curent: 0, zile_intarziere_max: 0 },
  { id: 2, nume: "PORR CONSTRUCT SRL", cui: "RO23456789", adresa: "Bd. Independenței 42, Cluj-Napoca", sold_curent: 13915, zile_intarziere_max: 12 },
  { id: 3, nume: "COLAS ROMANIA SA", cui: "RO34567890", adresa: "Str. Drumului 78, Timișoara", sold_curent: 49980, zile_intarziere_max: 25 },
  { id: 4, nume: "ROMSTRADE SRL", cui: "RO45678901", adresa: "Calea Victoriei 120, București", sold_curent: 0, zile_intarziere_max: 0 },
  { id: 5, nume: "EUROCONSTRUCT SA", cui: "RO56789012", adresa: "Str. Fabricii 55, Iași", sold_curent: 77350, zile_intarziere_max: 45 },
  { id: 6, nume: "BITUNOVA SRL", cui: "RO67890123", adresa: "Bd. Petrochimiștilor 12, Ploiești", sold_curent: 28500, zile_intarziere_max: 8 },
  { id: 7, nume: "DROBETA TURNU SEVERIN SA", cui: "RO78901234", adresa: "Str. Portului 3, Drobeta", sold_curent: 15200, zile_intarziere_max: 62 },
];

export const furnizoriCuSold: FurnizorCuSold[] = [
  { id: 1, nume: "PETROM SA", cui: "RO11111111", adresa: "Bd. Energeticienilor 100, București", sold_curent: 0, zile_intarziere_max: 0 },
  { id: 2, nume: "CARIERE PIATRĂ SRL", cui: "RO22222222", adresa: "Str. Carierelor 25, Brașov", sold_curent: 18080, zile_intarziere_max: 15 },
  { id: 3, nume: "BITUM TRADE SA", cui: "RO33333333", adresa: "Calea Rafinăriei 50, Constanța", sold_curent: 92820, zile_intarziere_max: 30 },
  { id: 4, nume: "ENERGIE ELECTRICA SA", cui: "RO44444444", adresa: "Str. Voltului 1, București", sold_curent: 0, zile_intarziere_max: 0 },
  { id: 5, nume: "TRANSPORT AGREGATE SRL", cui: "RO55555555", adresa: "Șos. Industrială 88, Sibiu", sold_curent: 21420, zile_intarziere_max: 22 },
  { id: 6, nume: "FILLER PRODUCTION SRL", cui: "RO66666666", adresa: "Str. Minelor 15, Hunedoara", sold_curent: 8500, zile_intarziere_max: 5 },
];

// Mock facturi pentru fiecare client
export const facturiClienti: Record<number, FacturaIstoric[]> = {
  1: [
    { id: 1, nr_factura: "FC-001", data: "2024-01-15", data_scadenta: "2024-02-15", total: 17850, suma_achitata: 17850, suma_restanta: 0, status: "Achitată" },
    { id: 2, nr_factura: "FC-010", data: "2023-12-10", data_scadenta: "2024-01-10", total: 25000, suma_achitata: 25000, suma_restanta: 0, status: "Achitată" },
  ],
  2: [
    { id: 1, nr_factura: "FC-002", data: "2024-01-18", data_scadenta: "2024-02-18", total: 33915, suma_achitata: 20000, suma_restanta: 13915, status: "Parțial" },
    { id: 2, nr_factura: "FC-008", data: "2023-12-20", data_scadenta: "2024-01-20", total: 18500, suma_achitata: 18500, suma_restanta: 0, status: "Achitată" },
  ],
  3: [
    { id: 1, nr_factura: "FC-003", data: "2024-01-22", data_scadenta: "2024-02-22", total: 49980, suma_achitata: 0, suma_restanta: 49980, status: "Neachitată" },
  ],
  4: [
    { id: 1, nr_factura: "FC-004", data: "2024-01-25", data_scadenta: "2024-02-25", total: 22312.5, suma_achitata: 22312.5, suma_restanta: 0, status: "Achitată" },
  ],
  5: [
    { id: 1, nr_factura: "FC-005", data: "2024-01-28", data_scadenta: "2024-02-28", total: 77350, suma_achitata: 0, suma_restanta: 77350, status: "Neachitată" },
    { id: 2, nr_factura: "FC-012", data: "2023-11-15", data_scadenta: "2023-12-15", total: 45000, suma_achitata: 45000, suma_restanta: 0, status: "Achitată" },
  ],
  6: [
    { id: 1, nr_factura: "FC-015", data: "2024-02-05", data_scadenta: "2024-03-05", total: 28500, suma_achitata: 0, suma_restanta: 28500, status: "Neachitată" },
  ],
  7: [
    { id: 1, nr_factura: "FC-018", data: "2023-12-01", data_scadenta: "2024-01-01", total: 15200, suma_achitata: 0, suma_restanta: 15200, status: "Neachitată" },
  ],
};

export const incasariClienti: Record<number, PlataIstoric[]> = {
  1: [
    { id: 1, data: "2024-02-10", tip: "OP", suma: 17850, document_referinta: "FC-001" },
    { id: 2, data: "2024-01-05", tip: "OP", suma: 25000, document_referinta: "FC-010" },
  ],
  2: [
    { id: 1, data: "2024-02-15", tip: "OP", suma: 20000, document_referinta: "FC-002" },
    { id: 2, data: "2024-01-18", tip: "OP", suma: 18500, document_referinta: "FC-008" },
  ],
  3: [],
  4: [
    { id: 1, data: "2024-02-20", tip: "OP", suma: 22312.5, document_referinta: "FC-004" },
  ],
  5: [
    { id: 1, data: "2023-12-10", tip: "OP", suma: 45000, document_referinta: "FC-012" },
  ],
  6: [],
  7: [],
};

export const soldIntervaleClienti: Record<number, SoldIntervale> = {
  1: { interval_0_30: 0, interval_30_60: 0, interval_60_plus: 0 },
  2: { interval_0_30: 13915, interval_30_60: 0, interval_60_plus: 0 },
  3: { interval_0_30: 49980, interval_30_60: 0, interval_60_plus: 0 },
  4: { interval_0_30: 0, interval_30_60: 0, interval_60_plus: 0 },
  5: { interval_0_30: 0, interval_30_60: 77350, interval_60_plus: 0 },
  6: { interval_0_30: 28500, interval_30_60: 0, interval_60_plus: 0 },
  7: { interval_0_30: 0, interval_30_60: 0, interval_60_plus: 15200 },
};

// Mock facturi furnizori
export const facturiFurnizoriIstoric: Record<number, FacturaIstoric[]> = {
  1: [
    { id: 1, nr_factura: "FF-2024-001", data: "2024-01-10", data_scadenta: "2024-02-10", total: 53550, suma_achitata: 53550, suma_restanta: 0, status: "Achitată" },
  ],
  2: [
    { id: 1, nr_factura: "FF-2024-002", data: "2024-01-12", data_scadenta: "2024-02-12", total: 38080, suma_achitata: 20000, suma_restanta: 18080, status: "Parțial" },
  ],
  3: [
    { id: 1, nr_factura: "FF-2024-003", data: "2024-01-15", data_scadenta: "2024-02-15", total: 92820, suma_achitata: 0, suma_restanta: 92820, status: "Neachitată" },
  ],
  4: [
    { id: 1, nr_factura: "FF-2024-004", data: "2024-01-18", data_scadenta: "2024-02-18", total: 14875, suma_achitata: 14875, suma_restanta: 0, status: "Achitată" },
  ],
  5: [
    { id: 1, nr_factura: "FF-2024-005", data: "2024-01-20", data_scadenta: "2024-02-20", total: 21420, suma_achitata: 0, suma_restanta: 21420, status: "Neachitată" },
  ],
  6: [
    { id: 1, nr_factura: "FF-2024-010", data: "2024-02-08", data_scadenta: "2024-03-08", total: 8500, suma_achitata: 0, suma_restanta: 8500, status: "Neachitată" },
  ],
};

export const platiFurnizori: Record<number, PlataIstoric[]> = {
  1: [
    { id: 1, data: "2024-02-05", tip: "OP", suma: 53550, document_referinta: "FF-2024-001" },
  ],
  2: [
    { id: 1, data: "2024-02-10", tip: "OP", suma: 20000, document_referinta: "FF-2024-002" },
  ],
  3: [],
  4: [
    { id: 1, data: "2024-02-15", tip: "OP", suma: 14875, document_referinta: "FF-2024-004" },
  ],
  5: [],
  6: [],
};

export const soldIntervaleFurnizori: Record<number, SoldIntervale> = {
  1: { interval_0_30: 0, interval_30_60: 0, interval_60_plus: 0 },
  2: { interval_0_30: 18080, interval_30_60: 0, interval_60_plus: 0 },
  3: { interval_0_30: 0, interval_30_60: 92820, interval_60_plus: 0 },
  4: { interval_0_30: 0, interval_30_60: 0, interval_60_plus: 0 },
  5: { interval_0_30: 21420, interval_30_60: 0, interval_60_plus: 0 },
  6: { interval_0_30: 8500, interval_30_60: 0, interval_60_plus: 0 },
};

// Scadențar combinat
export const scadentarEntries: ScadentarEntry[] = [
  { id: 1, tip_partener: "Client", nume_partener: "PORR CONSTRUCT SRL", tip_document: "Factură client", numar_document: "FC-002", data_document: "2024-01-18", data_scadenta: "2024-02-18", suma_restanta: 13915, zile_intarziere: 12, status: "Întârziat" },
  { id: 2, tip_partener: "Client", nume_partener: "COLAS ROMANIA SA", tip_document: "Factură client", numar_document: "FC-003", data_document: "2024-01-22", data_scadenta: "2024-02-22", suma_restanta: 49980, zile_intarziere: 25, status: "Întârziat" },
  { id: 3, tip_partener: "Client", nume_partener: "EUROCONSTRUCT SA", tip_document: "Factură client", numar_document: "FC-005", data_document: "2024-01-28", data_scadenta: "2024-02-28", suma_restanta: 77350, zile_intarziere: 45, status: "Întârziat" },
  { id: 4, tip_partener: "Client", nume_partener: "BITUNOVA SRL", tip_document: "Factură client", numar_document: "FC-015", data_document: "2024-02-05", data_scadenta: "2024-03-05", suma_restanta: 28500, zile_intarziere: 8, status: "Întârziat" },
  { id: 5, tip_partener: "Client", nume_partener: "DROBETA TURNU SEVERIN SA", tip_document: "Factură client", numar_document: "FC-018", data_document: "2023-12-01", data_scadenta: "2024-01-01", suma_restanta: 15200, zile_intarziere: 62, status: "Întârziat" },
  { id: 6, tip_partener: "Furnizor", nume_partener: "CARIERE PIATRĂ SRL", tip_document: "Factură furnizor", numar_document: "FF-2024-002", data_document: "2024-01-12", data_scadenta: "2024-02-12", suma_restanta: 18080, zile_intarziere: 15, status: "Întârziat" },
  { id: 7, tip_partener: "Furnizor", nume_partener: "BITUM TRADE SA", tip_document: "Factură furnizor", numar_document: "FF-2024-003", data_document: "2024-01-15", data_scadenta: "2024-02-15", suma_restanta: 92820, zile_intarziere: 30, status: "Întârziat" },
  { id: 8, tip_partener: "Furnizor", nume_partener: "TRANSPORT AGREGATE SRL", tip_document: "Factură furnizor", numar_document: "FF-2024-005", data_document: "2024-01-20", data_scadenta: "2024-02-20", suma_restanta: 21420, zile_intarziere: 22, status: "Întârziat" },
  { id: 9, tip_partener: "Furnizor", nume_partener: "FILLER PRODUCTION SRL", tip_document: "Factură furnizor", numar_document: "FF-2024-010", data_document: "2024-02-08", data_scadenta: "2024-03-08", suma_restanta: 8500, zile_intarziere: 5, status: "Întârziat" },
];
