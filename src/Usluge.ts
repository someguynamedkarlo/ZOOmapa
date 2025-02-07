
export enum Kategorija {
  ZDRAVSTVENO_OSIGURANJE,
  ZA_MLADE,
  ZA_DJECU,
  PREVENCIJA,
  OBITELJSKA_MEDICINA, // ordinacije
  HITNA_POMOC,
  BOLNICE,
  MENTALNO_ZDRAVLJE,
  ZDRAVLJE_ZENA,
  REHABILITACIJA,
  STOMATOLOZI,
  LJEKARNE_S_DEZURSTVIMA,
  LJEKARNE_BEZ_DEZURSTVA,
  VETERINARI,
  PRIVATNICI,
  DARIVANJE_KRVI,
};

export const AllCategories: Kategorija[] = Object.values(Kategorija)
  .filter((value): value is Kategorija => typeof value === "number");

export function kategorijaToString(k: Kategorija): string {
  switch (k) {
    case Kategorija.ZDRAVSTVENO_OSIGURANJE: return "Zdravstveno osiguranje";
    case Kategorija.ZA_MLADE: return "Usluge (specifično) za mlade";
    case Kategorija.ZA_DJECU: return "Usluge (specifično) za djecu";
    case Kategorija.PREVENCIJA: return "Prevencija - promicanje zdravlja i suzbijanje bolesti";
    case Kategorija.OBITELJSKA_MEDICINA: return "Ordinacije i ambulante";
    case Kategorija.HITNA_POMOC: return "Hitna medicinska pomoć";
    case Kategorija.BOLNICE: return "Bolnice";
    case Kategorija.MENTALNO_ZDRAVLJE: return "Zaštita mentalnog zdravlja i suzbijanje ovisnosti";
    case Kategorija.ZDRAVLJE_ZENA: return "Zdravlje žena i reproduktivno zdravlje";
    case Kategorija.REHABILITACIJA: return "Podrška oboljelima i rehabilitacija";
    case Kategorija.STOMATOLOZI: return "Stomatolozi";
    case Kategorija.LJEKARNE_S_DEZURSTVIMA: return "Ljekarne s dežurstvima";
    case Kategorija.LJEKARNE_BEZ_DEZURSTVA: return "Ljekarne bez dežurstava";
    case Kategorija.VETERINARI: return "Veterinari";
    case Kategorija.PRIVATNICI: return "Privatne bolnice i poliklinike";
    case Kategorija.DARIVANJE_KRVI: return "Darivanje krvi";
  }
}

export enum TipVlasnikaUsluge {
  DRZAVA, // javno
  PRIVATNO
}

export const AllTipVlasnikaUsluge: TipVlasnikaUsluge[] = Object.values(TipVlasnikaUsluge)
  .filter((value): value is TipVlasnikaUsluge => typeof value === "number");

export function tipVlasnikaToString(tip: TipVlasnikaUsluge): string {
  switch (tip) {
    case TipVlasnikaUsluge.DRZAVA: return "Državna ustanova";
    case TipVlasnikaUsluge.PRIVATNO: return "Privatna ustanova";
  }
}

export enum KategorijaKorisnika {
  SVI,
  MLADI_PUNOLJETNI,
  MLADI,
  DJECA,
  OSOBE_S_INVALIDITETOM,
  TRUDNICE_I_MAJKE,
  STUDENTI,
  ZENE,
  UCENICI_OS_SS,
  MLADI_PUNOLJETNI_I_ODRASLI,
  ZIVOTINJE
}

export const AllKategorijaKorisnika: KategorijaKorisnika[] = Object.values(KategorijaKorisnika)
  .filter((value): value is KategorijaKorisnika => typeof value === "number");

export function kategorijaKorisnikaToString(tip: KategorijaKorisnika): string {
  switch (tip) {
    case KategorijaKorisnika.SVI: return "Sve dobne skupine";
    case KategorijaKorisnika.MLADI_PUNOLJETNI: return "Mlade punoljetne osobe";
    case KategorijaKorisnika.MLADI: return "Mladi (neovisno o dobi)";
    case KategorijaKorisnika.DJECA: return "Djeca (do 13 godina)";
    case KategorijaKorisnika.OSOBE_S_INVALIDITETOM: return "Osobe s invaliditetom";
    case KategorijaKorisnika.TRUDNICE_I_MAJKE: return "Trudnice / majke";
    case KategorijaKorisnika.STUDENTI: return "Studenti";
    case KategorijaKorisnika.ZENE: return "Žene";
    case KategorijaKorisnika.UCENICI_OS_SS: return "Učenici osnovnih i srednjih škola";
    case KategorijaKorisnika.MLADI_PUNOLJETNI_I_ODRASLI: return "Mlade punoljetne osobe i odrasli";
    case KategorijaKorisnika.ZIVOTINJE: return "Životinje / kućni ljubimci ";
  }  
}

export enum Trosak {
  BESPLATNO,
  CJENIK,
  UGLAVNOM_BESPLATNO,
  OVISI_O_USLUZI,
  OVISI_O_LIJEKU
}

export const AllTrosak: Trosak[] = Object.values(Trosak)
  .filter((value): value is Trosak => typeof value === "number");

export function trosakKorisnikaToString(tip: Trosak): string {
  switch (tip) {
    case Trosak.BESPLATNO: return "Besplatno za (osiguranog) korisnika";
    case Trosak.CJENIK: return "Naplata sukladno cjeniku usluga";
    case Trosak.UGLAVNOM_BESPLATNO: return "Uglavnom besplatno za korisnika - pojedine usluge se ostvaruju uz nadoplatu";
    case Trosak.OVISI_O_USLUZI: return "Ovisno o vrsti usluge";
    case Trosak.OVISI_O_LIJEKU: return "Ovisno o vrsti lijeka";
  }  
}

export type Usluga = {
  id: number;
  kategorija: Kategorija;
  imeUstanove: string;
  javnoIliPrivatno: TipVlasnikaUsluge | null;
  nazivUsluge: string;
  opisUsluge: string;
  kategorijaKorisnika: KategorijaKorisnika | null;
  trosakKorisnika: Trosak | null;
  adresa: string;
  lat: number;
  lng: number;
  telefon: string;
  email: string;
  web: string;
  dodatneInfo: string;
  // ostaleKategorije je fix za duplicirane redove - spoji im sve kategorije tako da search i filter rade kako treba
  // Moze sadrzavati duplikate
  ostaleKategorije: Kategorija[];
};