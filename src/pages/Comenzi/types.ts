export interface Furnizor {
  id: number;
  nume: string;
  adresa: string;
  cui: string;
  nr_reg: string;
}

export interface Client {
  id: number;
  nume: string;
  adresa: string;
  cui: string;
  nr_reg: string;
}

export interface Material {
  materiale_prime: string;
}

export interface Produs {
  produs: string;
}

export interface ComandaMateriePrima {
  id: number;
  cod: string;
  data: string;
  furnizor: string;
  material: string;
  unitate_masura: string;
  cantitate: number;
  punct_descarcare: string | null;
  pret_fara_tva: number;
  pret_transport: number | null;
  observatii: string;
}

export interface ComandaProdusFinal {
  id: number;
  cod: string;
  data: string;
  client: string;
  produs: string;
  unitate_masura: string;
  cantitate: number;
  punct_descarcare: string | null;
  pret_fara_tva: number;
  pret_transport: number | null;
  observatii: string;
}
