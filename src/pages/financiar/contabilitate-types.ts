export interface NotaContabila {
  id: string;
  data: string;
  nrNota: string;
  tipJurnal: 'Vânzări' | 'Cumpărări' | 'Bancă' | 'Casă' | 'Diverse';
  explicatie: string;
  sursa: 'Automat' | 'Manual';
  totalDebit: number;
  totalCredit: number;
}

export interface LinieNotaContabila {
  id: string;
  notaId: string;
  cont: string;
  denumireCont: string;
  debit: number;
  credit: number;
}

export interface ContBalanta {
  cont: string;
  denumire: string;
  soldInitialDebit: number;
  soldInitialCredit: number;
  rulajDebit: number;
  rulajCredit: number;
  soldFinalDebit: number;
  soldFinalCredit: number;
}

export interface MiscareCont {
  id: string;
  data: string;
  document: string;
  explicatie: string;
  debit: number;
  credit: number;
  soldDupa: number;
}

export interface Raport {
  id: string;
  titlu: string;
  descriere: string;
  categorie: 'Profit' | 'Cashflow' | 'Marjă' | 'Solduri';
  icon: string;
}
