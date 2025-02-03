import { Kategorija, KategorijaKorisnika, TipVlasnikaUsluge, Trosak, Usluga } from "./Usluge";

function conform(s: any): string {
  if (s === null || s === undefined) return "";
  if (s.trim === undefined) s = s.toString();
  s = (s as string).trim();
  if (s.toUpperCase() === "N/A") return "";
  if (s === "?") return "";
  return s;
}

// TODO: log ako se vrati null (i ako je ukljucen log)
function createCategory(kategorija: string, podkategorija: string): Kategorija | null {
  switch (kategorija) {
    case "ZDRAVSTVENO OSIGURANJE": return Kategorija.ZDRAVSTVENO_OSIGURANJE;
    case "USLUGE (SPECIFIČNO) ZA MLADE": return Kategorija.ZA_MLADE;
    case "USLUGE (SPECIFIČNO) ZA DJECU": return Kategorija.ZA_DJECU;
    case "PREVENCIJA - PROMICANJE ZDRAVLJA I SUZBIJANJE BOLESTI": return Kategorija.PREVENCIJA;
    case "ORDINACIJE I AMBULANTE": return Kategorija.OBITELJSKA_MEDICINA;
    case "HITNA MEDICINSKA POMOĆ": return Kategorija.HITNA_POMOC;
    case "BOLNICE": return Kategorija.BOLNICE;
    case "ZAŠTITA MENTALNOG ZDRAVLJA I SUZBIJANJE OVISNOSTI": return Kategorija.MENTALNO_ZDRAVLJE;
    case "ZDRAVLJE ŽENA I REPRODUKTIVNO ZDRAVLJE": return Kategorija.ZDRAVLJE_ZENA;
    case "PODRŠKA OBOLJELIMA I REHABILITACIJA": return Kategorija.REHABILITACIJA;
    case "STOMATOLOZI": return Kategorija.STOMATOLOZI;
    case "LJEKARNE": {
      switch (podkategorija) {
        case "S DEŽURSTVIMA": return Kategorija.LJEKARNE_S_DEZURSTVIMA;
        case "BEZ DEŽURSTAVA": return Kategorija.LJEKARNE_BEZ_DEZURSTVA;
        default: return null;
      }
    }
    case "VETERINARI": return Kategorija.VETERINARI;
    case "PRIVATNE BOLNICE I POLIKLINIKE": return Kategorija.PRIVATNICI;
    case "OSTALE USLUGE - NEKATEGORIZIRANO (darivanje krvi)": return Kategorija.DARIVANJE_KRVI;
    default: return null;
  }  
}

// TODO: log ako se vrati null (i ako je ukljucen log)
function createTipVlasnikaUsluge(s: string): TipVlasnikaUsluge | null {
  switch (conform(s)) {
    case "Javna (državna) ustanova": return TipVlasnikaUsluge.DRZAVA;
    case "Privatna ustanova": return TipVlasnikaUsluge.PRIVATNO;
    default: return null;
  }
}

// TODO: log ako se vrati null (i ako je ukljucen log)
function createKategorijaKorisnika(k: string): KategorijaKorisnika | null {
  switch (conform(k)) {
    case "Sve dobne skupine": return KategorijaKorisnika.SVI;
    case "Mlade punoljetne osobe": return KategorijaKorisnika.MLADI_PUNOLJETNI;
    case "Mladi (neovisno o dobi)": return KategorijaKorisnika.MLADI;
    case "Djeca (do 13 godina)": return KategorijaKorisnika.DJECA;
    case "Osobe s invaliditetom": return KategorijaKorisnika.OSOBE_S_INVALIDITETOM;
    case "Trudnice / majke": return KategorijaKorisnika.TRUDNICE_I_MAJKE;
    case "Studenti": return KategorijaKorisnika.STUDENTI;
    case "Žene": return KategorijaKorisnika.ZENE;
    case "Učenici osnovnih i srednjih škola": return KategorijaKorisnika.UCENICI_OS_SS;
    case "Mlade punoljetne osobe i odrasli": return KategorijaKorisnika.MLADI_PUNOLJETNI_I_ODRASLI;
    case "Životinje / kućni ljubimci ": return KategorijaKorisnika.ZIVOTINJE;
    default: return null;
  }
}

// TODO: log ako se vrati null (i ako je ukljucen log)
function createTrosakKorisnika(t: string): Trosak | null {
  switch (conform(t)) {
    case "Besplatno za (osiguranog) korisnika": return Trosak.BESPLATNO;
    case "Naplata sukladno cjeniku usluga": return Trosak.CJENIK;
    case "Uglavnom besplatno za korisnika - pojedine usluge se ostvaruju uz nadoplatu": return Trosak.UGLAVNOM_BESPLATNO;
    case "Ovisno o vrsti usluge": return Trosak.OVISI_O_USLUZI;
    case "Ovisno o vrsti lijeka": return Trosak.OVISI_O_LIJEKU;
    default: return null;
  }
}

// TODO: print tj. test ove podatke
const fetchData = async (): Promise<Usluga[]> => {
  try {
    const response = await fetch("/BAZA4.json");
    const data = await response.json() as any[];
    
    let previousKategorija: string = "";
    let previousPodkategorija: string = "";

    const result: Usluga[] = data.map((u: any, index) => {
      const lat = parseFloat(u.LATITUDE);
      const lng = parseFloat(u.LONGITUDE);

      let kategorija = conform(u.KATEGORIJA);
      let podkategorija = conform(u.PODKATEGORIJA);

      // Fix za spojene stupce - treba pamtiti sto je zadnje
      // bilo jer je podatak zapisan samo u najgorenjem stupcu
      // Promjena kategorije znaci i promjenu podkategorije.
      if (kategorija.length === 0) {
        kategorija = previousKategorija;
        podkategorija = podkategorija === "" ? previousPodkategorija : podkategorija;
      }

      const kategorijaEnum = createCategory(kategorija, podkategorija);
      const tipVlasnika = createTipVlasnikaUsluge(u["KATEGORIJA USTANOVE"]);
      const korisnici = createKategorijaKorisnika(u["KATEGORIJA KORISNIKA"])
      const trosakKorisnika = createTrosakKorisnika(u["CIJENA"])

      let converted: Usluga | null = null;
      if (kategorijaEnum !== null && !isNaN(lat) && !isNaN(lng)) {
        converted = {
          id: index + 1,
          kategorija: kategorijaEnum,
          imeUstanove: conform(u.USTANOVA),
          javnoIliPrivatno: tipVlasnika,
          nazivUsluge: conform(u["NAZIV USLUGE"]),
          opisUsluge: conform(u["OPIS USLUGE"]),
          kategorijaKorisnika: korisnici,
          trosakKorisnika: trosakKorisnika,
          adresa: conform(u.ADRESA),
          lat: lat,
          lng: lng,
          telefon: conform(u.TELEFON),
          email: conform(u.EMAIL),
          web: conform(u.WEB),
          dodatneInfo: conform(u["DODATNE INFORMACIJE"]),
        }
      }
      
      // TODO: log ako je null za debug
      // console.log("heheheheh ", JSON.stringify(converted));
      
      previousKategorija = kategorija;
      previousPodkategorija = podkategorija;

      return converted;
    })
    .filter(u => u !== null);
    
    return result;
  } catch (err) {
    console.error("Error fetching data:", err);
    return [];
  }
};

export default fetchData;
