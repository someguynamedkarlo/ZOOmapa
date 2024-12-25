type Usluga = {
  imeUstanove: string;
  lat: number;
  lng: number;
  adresa: string;
  telefon: string;
  email: string;
  web: string;
  radnoVrijeme: string;
  preduvjeti: string;
  trosak: string;
  namjenjeno: string;
  opis: string;
  specUsluga: string /*specificna usluga */;
  pruzatelj: string /*KATEGORIJA PRUŽATELJA USLUGE (USTANOVE) */;
  kategorija: string /*KATEGORIJA USLUGE */;
};

const popisUsluga: Usluga[] = [
  {
    imeUstanove:
      "Hrvatski zavod za zdravstveno osiguranje područna ustrojstvena jedinica Rijeka",
    lat: 45.32827734734475,
    lng: 14.442288929159593,
    adresa: "Slogin kula 1, 51000, Rijeka",
    telefon: "051 351 111",
    email: "pisarnica-rijeka@hzzo.hr racunovodstvo.dopunsko_rijeka@hzzo.hr",
    web: "https://hzzo.hr/kontakt/rijeka",
    radnoVrijeme:
      "pon - pet: 08:00 h - 16:00 h subota: zatvoreno nedjelja: zatvoreno",
    preduvjeti: "N/A",
    trosak: "N/A",
    namjenjeno: "sve dobne skupine",
    opis: "Prijave, promjene i odjave",
    specUsluga: "Obvezno zdravstveno osiguranje",
    pruzatelj: "Javna (državna) ustanova",
    kategorija: "Zdravstveno osiguranje",
  },
];
