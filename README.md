# ZOOmapa
**Interaktivna mapa zdravstvenih usluga u gradu Rijeci**

## Podaci

Svi podaci nalaze se u XLSX tablici. Koristiti neki online converter (npr. [aspose](https://products.aspose.app/cells/conversion/xlsx-to-json)) za pretvoriti dokument u JSON.

Spojeni stupci u tablici su dozvoljeni samo za stupce "KATEGORIJA" i "PODKATEGORIJA" jer su oni podržani u kodu za čitanje JSON podataka.
Spajanje redaka je isto dozvoljeno samo za spajanje kategorije i podkategorije.

Prazni redci (kategorija i podkategorija mogu biti definirani) su dozvoljeni jer će ih kod za učitavanje JSON podataka zanemariti.

## Tiles

Tiles su potrebi za crtanje karte. Za testiranje se mogu koristiti javni besplati tile serveri.
Ali za production to nije dozvoljeno nego se mora postaviti vlastiti server ili (ono što smo mi odabrali) ručno skinuti sve tileova (postoji skripta u drugom projektu za to) i staviti ih u `public/` directory.

Prati [ovaj tutorial](https://switch2osm.org/serving-tiles/using-a-docker-container/) (postavljanje u dockeru je jednostavno) i tiles za Hrvatsku preuzmi [odavdje](https://download.geofabrik.de/europe.html)

Vidi file `all_tiles.txt` gdje su svi skinuti tiles i njihova struktura u direktorijima.


