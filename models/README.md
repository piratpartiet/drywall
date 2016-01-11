Dokumentasjon av databasestrukturen

User
====

Denne kunne ikke enkelt renames pga mange referanser i drywall, men i databaselaget har den blitt renamet til "login_user" for å unngå kollisjon med det reserverte ordet "user" i SQL.

Brukertabellen inneholder alt av relevans for "brukere som kan logge inn", enten det er medlemmer eller andre brukertyper.

Attributtinformasjon:

* username - bitbear mener vi burde droppe denne og bare logge inn med epostadresse, tobixen er litt uenig.
* password - kryptert på noe vis, håper jeg? (TODO)

Member
======

Se også https://wiki.piratpartiet.no/index.php?title=Medlemsdatabase/kravspesifikasjon

Tabell med medlemsopplysninger.  Merk at det ikke er tilstrekkelig å bare være med i tabellen for å være medlem, man må også ha betalt kontingent for å være faktisk medlem.  Det er mulig vi bør ha en redundant boolean her for å indikere om medlemskontingenten er registrert innbetalt eller ikke, pr i dag må man sjekke dette eksplisitt i payment-tabellen.

Attributtinformasjon:

* isVerified - usikker på om dette er noe som brukes av drywall?
* memberNumber - medlemsnummeret gis sekvensielt og tildeles første gang medlemmet betaler medlemskontingent.  Mulig vi fikser dette gjennom trigger eller eksternt skript.
* address, zip - skal være folkeregistrert adresse og postnummer
* municipality og county - angir hvilken kommune og fylke medlemmet ønsker å ha stemmerett i.  Dette trenger ikke nødvendigvis å samsvare med folkeregistrert addresse.
* year_birth - sekretæriatet mener at fødselsår skal være obligatorisk informasjon ved innregistrering av medlemsskap.  Årsaken er at dette muliggjør en del søknader om støttemidler basert på medlemstall.
* date_birth - delvis overlappende med forrige.  Dersom medlemmet ønsker å bli oppført på lister, trenger vi fødselsdatoen.  Ikke obligatorisk.
* electable - et lavt tall indikerer at medlemmet overhodet ikke har ønske om å bli ført opp på valglister, et høyt tall indikerer at medlemmet ønsker en prominent plass på alt av valglister.  Se https://wiki.piratpartiet.no/index.php?title=Medlemsdatabase/kravspesifikasjon#Valglistekandidatur
* mailable - som over, et lavt tall indikerer at medlemmet overhodet ikke ønsker å få mail av oss, et høyt tall indikerer at medlemmet ønsker å bli holdt kontinuerlig oppdatert om "alt" som foregår pr epost.
* memberSince - burde vært redundant, informasjonen bør også kunne hentes fra payment-tabellen, men vi har ikke historiske innbetalinger her.
* lastMembershipFeePaid - redundant, skal populeres fra payment-tabellen, kanskje vha en trigger?

Admin
=====

Drywall-administrator-bruker.  Subtype av "User" (login_user i databasen).

AdminGroup, Category, Message, Note, Status, StatusLog
======================================================

noe drywallgreier?  TODO

LoginAttempt
============

Er det bare mislykkede innlogginger som registreres her?  Bør ikke tabellen ha en bool på om innloggingen var vellykket eller ikke?

Payment
=======

Tabell for innbetalinger.

* amount_bc - beløp i "base currency", altså NOK.
* amount_rc - beløp i "remote currency", normalt sett NOK-beløp, men kan f.eks. være bitcoinbeløp eller EUR-beløp ved en SEPA-overførsel.
* currency - valutatype, normalt sett NOK, men kan også f.eks. være XBT.
* purpose - her bør vi kanskje ha en ekstra tabell for å holde rede på konstantene.  0 = donasjon, 1 = medlemskontingent, 2=...?
* payment_date - skal populeres når transaksjonen ser ut til å ha kommet igjennom (dvs 0-conf bitcontransaksjon, vellykket kredittkortbetaling over webgrensesnitt, etc, minst 60 i "payment_status")
* payment_address - bitcoinaddresse ved bitcoininnbetaling, KID eller betalingstekst ved bankoverføring m/ KID eller tekstfelt, etc.
* payment_connection - kontonummer pengene har kommet inn på, evt hvilken wallet ved bitcoininnbetaling, hvem som har mottatt kontantene ved kontantinnbetaling, etc.
* txid - transaksjons-id.
* payment_status - her bør vi kanskje også ha en ekstra tabell for å holde rede på konstantene.  Mellomrom i nummerserien gir mulighet til å tweake i ettertid, samt legge til statuskoder som er 
  * 0 - betalingen ikke initiert enda; raden er skrevet til databasen, men vi har ikke sendt noe regning e.l. til kunden enda.
  * 10 - kunden har fått regning, evt webkredittkortbetalingsgreie er initiert.
  * 20-30 - pga teknisk feil har vi ingen oversikt over om beløpet er betalt eller ikke.
  * 40-60 - innbetalingen har feilet, f.eks. ikke dekning på kredittkort.  40 = generell/ukjent feil, 41 = feil beløp.
  * 60 - innbetalingen ser ut til å ha kommet igjennom.  Dette inkluderer en 0-conf bitcointransaksjon, samt en vellykket kredittkortbetaling over webgrensesnittet.
  * 70 - innbetalingen bekreftet.  Kredittkorttransaksjonen har kommet med på kontoutskrift, minst én bekreftelse på en bitcointransaksjon.
  * 80 - innbetalingen endelig bekreftet.  En kredittkorttransaksjon ligger såpass mange måneder tilbake i tid at chargeback ikke er aktuelt.  En bitcointransaksjon har minst 6 bekreftelser.

Role assignment
===============
Rolletildelinger - for å vises på websider, samt gi admintilganger til systemer, m.m.

* role_title - kan bl.a. være 'leder', 'styremedlem', 'kasserer', m.m.  Valgt å være tekstfelt for enkelhet og fleksibilitetens skyld, men det er viktig at vi er konsistente.  Muligens at vi heller burde hatt en int og spekke ut en egen tabell med mulige roller.
* role_pretty_title - kan være f.eks. "admiral", "kaptein", "førstestyrkvinne", etc.  Tittel som skal være synlig utad.  For maskinell behandling benyttes alltid role_title.
* group_title - gruppetittel, f.eks. "Sentralstyret", "Oslo", "Sekretariatet", etc.
  * Fylkeslag: Alltid navnet på fylket.
  * Sammenslåtte fylkeslag: fylke+fylke
  * Kommunelag (samt bydelslag i Oslo): Fylke/Kommune.  F.eks. Oslo/Østensjø
  * Regionlag: Fylke/fritekstnavn på regionen, f.eks. "Akershus/Follo" eller "Akershus+Oslo/Groruddalen og Lørenskog".
* group_type:
  * 0: sentralstyret
  * 10: grupper/komitéer på sentralt nivå, f.eks "sekretariatet", "tech"
  * 20: regionlag/landsdelslag som dekker mer enn ett fylke, f.eks. "Aust-Agder+Vest-Agder"
  * 30: rene fylkeslag
  * 40: regionlag som går på kryss av fylkesgrenser, f.eks. "Akershus+Oslo/Groruddalen+Lørenskog".
  * 50: sammenslåtte kommunelag, f.eks. "Akershus/Asker+Bærum".
  * 60: kommunelag (samt bydelslag i Oslo)
  * 70: bydelslag i store kommuner utenom Oslo, f.eks. "Troms/Tromsø/Kvaløya"
  * 80: andre grupper/komitéer på lokalt nivå, f.eks. "Oslo/Tech".
