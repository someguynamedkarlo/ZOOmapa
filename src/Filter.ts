import { AllCategories, AllKategorijaKorisnika, AllTipVlasnikaUsluge, AllTrosak, Kategorija, KategorijaKorisnika, TipVlasnikaUsluge, Trosak, Usluga } from "./Usluge";

export type Filter = {
  kategorije: Kategorija[];
  vrstaUstanove: TipVlasnikaUsluge[];
  kategorijaKorisnika: KategorijaKorisnika[];
  trosakKorisnika: Trosak[];
}

export enum QuickFilter {
  HITNO, BOLNICE_I_ORDINACIJE, LJEKARNE, VETERINARI
}

export const AllQuickFilterValues: QuickFilter[] = Object.values(QuickFilter)
  .filter((value): value is QuickFilter => typeof value === "number");

export function quickFilterToString(qf: QuickFilter): string {
  switch (qf) {
    case QuickFilter.HITNO: return "Hitno!";
    case QuickFilter.BOLNICE_I_ORDINACIJE: return "Bolnice i ordinacije";
    case QuickFilter.LJEKARNE: return "Ljekarne";
    case QuickFilter.VETERINARI: return "Veterinari";
  }
}

export function makeDefaultFilter(): Filter {
  return {
    kategorije: AllCategories,
    vrstaUstanove: AllTipVlasnikaUsluge,
    kategorijaKorisnika: AllKategorijaKorisnika,
    trosakKorisnika: AllTrosak,
  };
}

export function makeHitnoFilter(): Filter {
  return {
    ...makeDefaultFilter(),
    kategorije: [Kategorija.HITNA_POMOC],
  };
}

export function makeBolniceIOrdinacijeFilter(): Filter {
  return {
    ...makeDefaultFilter(),
    kategorije: [Kategorija.BOLNICE, Kategorija.OBITELJSKA_MEDICINA],
  };
}

export function makeLjekarneFilter(): Filter {
  return {
    ...makeDefaultFilter(),
    kategorije: [Kategorija.LJEKARNE_S_DEZURSTVIMA, Kategorija.LJEKARNE_BEZ_DEZURSTVA],
  };
}

export function makeVeterinariFilter(): Filter {
  return {
    ...makeDefaultFilter(),
    kategorije: [Kategorija.VETERINARI],
    vrstaUstanove: AllTipVlasnikaUsluge,
  };
}

export function spadaLiUFilter(u: Usluga, f: Filter): boolean {
  if (!f.kategorije.includes(u.kategorija)) return false;
  else if (u.javnoIliPrivatno !== null && !f.vrstaUstanove.includes(u.javnoIliPrivatno)) return false;
  else if (u.kategorijaKorisnika !== null && !f.kategorijaKorisnika.includes(u.kategorijaKorisnika)) return false;
  else if (u.trosakKorisnika !== null && !f.trosakKorisnika.includes(u.trosakKorisnika)) return false;
  return true;
}
