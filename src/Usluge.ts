export type Usluga = {
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
/*
kategorija: Number[]
0-zdravstveno osiguranje
1- USLUGE (SPECIFIČNO) ZA MLADE
2 -USLUGE (SPECIFIČNO) ZA DJECU
3-PREVENCIJA - PROMICANJE ZDRAVLJA I SUZBIJANJE BOLESTI
4-ZDRAVSTVENI ODGOJ I OBRAZOVANJE
5-OBITELJSKA MEDICINA / OPĆA PRAKSA
6-HITNA MEDICINSKA POMOĆ
7-BOLNICE
8-PSIHIJATRIJSKO LIJEČENJE
9-PSIHOLOŠKO SAVJETOVANJE/POMOĆ
10-OSTALE SPECIJALIZIRANE USLUGE SAVJETOVANJA
11-PODRŠKA OVISNICIMA
12-ZDRAVLJE ŽENA I REPRODUKTIVNO ZDRAVLJE	
13-PODRŠKA OBOLJELIMA I REHABILITACIJA	
14-STOMATOLOZI	
15- LJEKARNE S DEZURSTVIMA
16- LJEKARNE BEZ DEZURSTAVA
17-VETERINARI	
18-PRIVATNE BOLNICE I POLIKLINIKE	
19-OSTALE USLUGE - NEKATEGORIZIRANO	
*/
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
    radVrijeme2: 0,
    preduvjeti: "N/A",
    trosak: 0,
    namjenjeno: "sve dobne skupine",
    opis: "Prijave, promjene i odjave",
    specUsluga: "Obvezno zdravstveno osiguranje",
    pruzatelj: "Javna (državna) ustanova",
    kategorija: [0],
  },
];

export { popisUsluga };
