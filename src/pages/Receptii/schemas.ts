import { z } from "zod";

export const receptieSchema = z.object({
  data: z.string().trim().min(1, "Data este obligatorie"),
  cod: z.string().trim().min(1, "Codul este obligatoriu").max(10),
  furnizor: z.string().trim().min(1, "Furnizorul este obligatoriu").max(100),
  material: z.string().trim().min(1, "Materialul este obligatoriu").max(100),
  nr_aviz_provizoriu: z.string().trim().max(10).optional(),
  nr_aviz_intrare: z.string().trim().max(10).optional(),
  nume_sofer: z.string().trim().min(1, "Numele șoferului este obligatoriu").max(100),
  nr_inmatriculare: z.string().trim().min(1, "Numărul de înmatriculare este obligatoriu").max(10),
  tip_masina: z.string().trim().min(1, "Tipul mașinii este obligatoriu").max(20),
  cantitate_livrata: z.number().min(0, "Cantitatea livrată trebuie să fie pozitivă"),
  cantitate_receptionata: z.number().min(0, "Cantitatea recepționată trebuie să fie pozitivă"),
  diferenta: z.number(),
  pret_material_total: z.number().min(0, "Prețul material trebuie să fie pozitiv"),
  pret_total: z.number().min(0, "Prețul total trebuie să fie pozitiv"),
  pret_transport_total: z.number().min(0, "Prețul transport trebuie să fie pozitiv"),
  observatii: z.string().trim().max(255).optional()
});
