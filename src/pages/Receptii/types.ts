export interface ReceptieMaterial {
  id: number;
  data: string;
  cod: string;
  furnizor: string;
  material: string;
  nr_aviz_provizoriu: string;
  nr_aviz_intrare: string;
  nume_sofer: string;
  nr_inmatriculare: string;
  tip_masina: string;
  cantitate_livrata: number;
  cantitate_receptionata: number;
  diferenta: number;
  pret_material_total: number;
  pret_total: number;
  pret_transport_total: number;
  observatii: string;
}
