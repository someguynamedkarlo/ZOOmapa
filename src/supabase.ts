import { Usluga } from "./Usluge";

// kategorija: number[]
// 0-zdravstveno osiguranje
// 1- USLUGE (SPECIFIČNO) ZA MLADE
// 2 -USLUGE (SPECIFIČNO) ZA DJECU
// 3-PREVENCIJA - PROMICANJE ZDRAVLJA I SUZBIJANJE BOLESTI
// 4-ZDRAVSTVENI ODGOJ I OBRAZOVANJE
// 5-OBITELJSKA MEDICINA / OPĆA PRAKSA
// 6-HITNA MEDICINSKA POMOĆ
// 7-BOLNICE
// 8-PSIHIJATRIJSKO LIJEČENJE
// 9-PSIHOLOŠKO SAVJETOVANJE/POMOĆ
// 10-OSTALE SPECIJALIZIRANE USLUGE SAVJETOVANJA
// 11-PODRŠKA OVISNICIMA
// 12-ZDRAVLJE ŽENA I REPRODUKTIVNO ZDRAVLJE	
// 13-PODRŠKA OBOLJELIMA I REHABILITACIJA	
// 14-STOMATOLOZI	
// 15- LJEKARNE S DEZURSTVIMA
// 16- LJEKARNE BEZ DEZURSTAVA
// 17-VETERINARI	
// 18-PRIVATNE BOLNICE I POLIKLINIKE	
// 19-OSTALE USLUGE - NEKATEGORIZIRANO	

function conform(s: string): string {
  s = s.trim();
  if (s.toUpperCase() === "N/A") return ""
  if (s === "?") return ""
  return s;
}

const fetchData = async (): Promise<Usluga[]> => {
  try {
    const response = await fetch("/BAZA3.json");
    const data = await response.json();
    
    const result: Usluga[] = []
    
    for (const u of data) {
      const lat = parseFloat(u.lat);
      const lng = parseFloat(u.lng);
      const kategorija = parseInt(u.kategorija);

      if (isNaN(lat) || isNaN(lng) || isNaN(kategorija)) continue;

      const converted: Usluga = {
        imeUstanove: conform(u.imeUstanove),
        lat: lat,
        lng: lng,
        adresa: conform(u.adresa),
        telefon: conform(u.telefon),
        // TODO: fali mi json u email podacima
        email: "", // conform(u.email),
        web: conform(u.web),
        radnoVrijeme: conform(u.radnoVrijeme),
        // TODO: ovo tu je za filtriranje 0-pon do pet 1- subota 2-rad nedjeljom
        // Privremeno sam stavio 0 jer nemam ovaj podatak
        radVrijeme2: 0,
        preduvjeti: conform(u.preduvjeti),
        // TODO: 0-besplatno 1-Naplata sukladno cjeniku usluga 2-Pojedine usluge uz nadoplatu
        // Privremeno sam stavio 0 jer nemam ovaj podatak
        trosak: 0,
        namjenjeno: conform(u.namjenjeno),
        opis: conform(u.opis),
        specUsluga: conform(u.specUsluga),
        pruzatelj: conform(u.pruzatelj),
        kategorija: [kategorija],
      }
      result.push(converted);
    }

    return result;
  } catch (err) {
    console.error("Error fetching data:", err);
    return [];
  }
};

export default fetchData;
