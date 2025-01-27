export type Usluga = {
  id: number;
  imeUstanove: string;
  lat: number;
  lng: number;
  adresa: string;
  telefon: string;
  email: string;
  web: string;
  radnoVrijeme: string;
  radVrijeme2: number /*ovo tu je za filtriranje 0-pon do pet 1- subota 2-rad nedjeljom*/;
  preduvjeti: string;
  trosak: number; // 0-besplatno 1-Naplata sukladno cjeniku usluga 2-Pojedine usluge uz nadoplatu
  namjenjeno: string;
  opis: string;
  specUsluga: string; // specifična usluga
  pruzatelj: string; // KATEGORIJA PRUŽATELJA USLUGE (USTANOVE)
  kategorija: number[]; // Categories
};