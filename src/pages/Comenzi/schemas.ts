import { z } from "zod";

export const comandaMPSchema = z.object({
  furnizor: z.string().trim().min(1, "Furnizorul este obligatoriu").max(255),
  material: z.string().trim().min(1, "Materialul este obligatoriu").max(255),
  unitate_masura: z.string().trim().min(1, "Unitatea de măsură este obligatorie").max(50),
  cantitate: z.number().min(0, "Cantitatea trebuie să fie pozitivă"),
  punct_descarcare: z.string().trim().max(255).optional(),
  pret_fara_tva: z.number().min(0, "Prețul trebuie să fie pozitiv"),
  pret_transport: z.number().min(0, "Prețul transport trebuie să fie pozitiv").optional(),
  observatii: z.string().trim().max(1000).optional()
});

export const comandaPFSchema = z.object({
  client: z.string().trim().min(1, "Clientul este obligatoriu").max(255),
  produs: z.string().trim().min(1, "Produsul este obligatoriu").max(255),
  unitate_masura: z.string().trim().min(1, "Unitatea de măsură este obligatorie").max(50),
  cantitate: z.number().min(0, "Cantitatea trebuie să fie pozitivă"),
  punct_descarcare: z.string().trim().max(255).optional(),
  pret_fara_tva: z.number().min(0, "Prețul trebuie să fie pozitiv"),
  pret_transport: z.number().min(0, "Prețul transport trebuie să fie pozitiv").optional(),
  observatii: z.string().trim().max(1000).optional()
});
