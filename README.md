# ZOOmapa
**Interaktivna mapa zdravstvenih usluga u gradu Rijeci**

## Podaci

Svi podaci nalaze se u XLSX tablici. Koristiti neki online converter (npr. [aspose](https://products.aspose.app/cells/conversion/xlsx-to-json)) za pretvoriti dokument u JSON.

Spojeni stupci u tablici su dozvoljeni samo za stupce "KATEGORIJA" i "PODKATEGORIJA" jer su oni podržani u kodu za čitanje JSON podataka.
Spajanje redaka je isto dozvoljeno samo za spajanje kategorije i podkategorije.

Prazni redci (kategorija i podkategorija mogu biti definirani) su dozvoljeni jer će ih kod za učitavanje JSON podataka zanemariti.

