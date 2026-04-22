/**
 * Restore accents in post_translations where entire bodies are stripped.
 *
 * Dictionaries below are unambiguous: the stripped form is not a valid standalone
 * word in the target locale, so restoration is safe. Ambiguous pairs (FR a/à,
 * ou/où, la/là, ES esta/está, DE "das"/etc.) are NOT in the dictionaries.
 *
 * Case handling: each pattern includes lowercase and sentence-case variants.
 *
 * Run:
 *   source .env && export PUBLIC_SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY && npx tsx scripts/restore-post-accents.ts          # dry
 *   source .env && export PUBLIC_SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY && npx tsx scripts/restore-post-accents.ts --apply
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';

const supabase = createClient(process.env.PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const apply = process.argv.includes('--apply');

// Each entry: pattern (word-boundary anchored, case-insensitive) → replacement.
// Replacement preserves case via capture group trickery where needed.
type Dict = Array<[RegExp, string]>;

const FR: Dict = [
  // Nouns / adjectives with clear accents
  [/\bcreme\b/g, 'crème'], [/\bCreme\b/g, 'Crème'],
  [/\bcremes\b/g, 'crèmes'], [/\bCremes\b/g, 'Crèmes'],
  [/\bcremeux\b/g, 'crémeux'], [/\bcremeuse\b/g, 'crémeuse'],
  [/\bcuillere\b/g, 'cuillère'], [/\bCuillere\b/g, 'Cuillère'],
  [/\bcuilleres\b/g, 'cuillères'], [/\bCuilleres\b/g, 'Cuillères'],
  [/\bcafe\b/g, 'café'], [/\bCafe\b/g, 'Café'],
  [/\bcafes\b/g, 'cafés'], [/\bCafes\b/g, 'Cafés'],
  [/\bfete\b/g, 'fête'], [/\bFete\b/g, 'Fête'],
  [/\bfetes\b/g, 'fêtes'], [/\bFetes\b/g, 'Fêtes'],
  [/\bpere\b/g, 'père'], [/\bPere\b/g, 'Père'],
  [/\bperes\b/g, 'pères'], [/\bPeres\b/g, 'Pères'],
  [/\bmere\b/g, 'mère'], [/\bMere\b/g, 'Mère'],
  [/\bmeres\b/g, 'mères'], [/\bMeres\b/g, 'Mères'],
  [/\bfrere\b/g, 'frère'], [/\bFrere\b/g, 'Frère'],
  [/\bfreres\b/g, 'frères'], [/\bFreres\b/g, 'Frères'],
  [/\bete\b/g, 'été'], [/\bEte\b/g, 'Été'],
  [/\betes\b/g, 'étés'],
  [/\bannee\b/g, 'année'], [/\bAnnee\b/g, 'Année'],
  [/\bannees\b/g, 'années'], [/\bAnnees\b/g, 'Années'],
  [/\bjournee\b/g, 'journée'], [/\bJournee\b/g, 'Journée'],
  [/\bjournees\b/g, 'journées'], [/\bJournees\b/g, 'Journées'],
  [/\bmatinee\b/g, 'matinée'], [/\bapres-midi\b/g, 'après-midi'],
  [/\bsoiree\b/g, 'soirée'], [/\bSoiree\b/g, 'Soirée'],
  [/\bproteine\b/g, 'protéine'], [/\bProteine\b/g, 'Protéine'],
  [/\bproteines\b/g, 'protéines'], [/\bProteines\b/g, 'Protéines'],
  [/\bproteine\b/gi, 'protéine'], [/\bproteines\b/gi, 'protéines'],
  [/\bproteinee\b/g, 'protéinée'], [/\bProteinee\b/g, 'Protéinée'],
  [/\bproteiniques?\b/g, (m) => m.replace('proteinique', 'protéinique')],
  [/\bresultat\b/g, 'résultat'], [/\bResultat\b/g, 'Résultat'],
  [/\bresultats\b/g, 'résultats'], [/\bResultats\b/g, 'Résultats'],
  [/\bgout\b/g, 'goût'], [/\bGout\b/g, 'Goût'],
  [/\bgouts\b/g, 'goûts'], [/\bGouts\b/g, 'Goûts'],
  [/\bepaisse\b/g, 'épaisse'], [/\bEpaisse\b/g, 'Épaisse'],
  [/\bepais\b/g, 'épais'], [/\bEpais\b/g, 'Épais'],
  [/\bepaisses\b/g, 'épaisses'],
  [/\bepaisseur\b/g, 'épaisseur'],
  [/\bmeme\b/g, 'même'], [/\bMeme\b/g, 'Même'],
  [/\bmemes\b/g, 'mêmes'],
  [/\bboite\b/g, 'boîte'], [/\bBoite\b/g, 'Boîte'],
  [/\bboites\b/g, 'boîtes'], [/\bBoites\b/g, 'Boîtes'],
  [/\bpatissi/g, 'pâtissi'], [/\bPatissi/g, 'Pâtissi'], // pâtisserie, pâtissier
  [/\bpate\b/g, 'pâte'], [/\bPate\b/g, 'Pâte'],
  [/\bpates\b/g, 'pâtes'],
  [/\bete-la\b/g, 'été-là'],
  [/\bdeja\b/g, 'déjà'], [/\bDeja\b/g, 'Déjà'],
  [/\btheme\b/g, 'thème'], [/\bThemes\b/g, 'Thèmes'],
  [/\bthemes\b/g, 'thèmes'],
  [/\btres\b/g, 'très'], [/\bTres\b/g, 'Très'],
  [/\bapres\b/g, 'après'], [/\bApres\b/g, 'Après'],
  [/\bpres\b/g, 'près'], [/\bPres\b/g, 'Près'],
  [/\bdegre\b/g, 'degré'], [/\bdegres\b/g, 'degrés'],
  [/\bceleri\b/g, 'céleri'],
  [/\btelephone\b/g, 'téléphone'],
  [/\boeuf\b/g, 'œuf'], [/\boeufs\b/g, 'œufs'],
  [/\bprefere\b/g, 'préféré'], [/\bprefe/g, 'préfé'],
  [/\bpreference\b/g, 'préférence'],
  [/\bprecede/g, 'précéde'],
  [/\bpreparat/g, 'préparat'],
  [/\bprepare\b/g, 'préparé'], [/\bpreparer\b/g, 'préparer'],
  [/\bPrepare\b/g, 'Préparé'],
  [/\bprofere/g, 'proféré'],
  [/\bpresent\b/g, 'présent'], [/\bpresente\b/g, 'présente'],
  [/\bPresente\b/g, 'Présente'],
  [/\bpreserv/g, 'préserv'],
  [/\bprecis/g, 'précis'], [/\bPrecis/g, 'Précis'],
  [/\bdecide/g, 'décidé'],
  [/\bdecouvr/g, 'découvr'], [/\bDecouvr/g, 'Découvr'],
  [/\bdecor/g, 'décor'], [/\bDecor/g, 'Décor'],
  [/\bdelici/g, 'délici'], [/\bDelici/g, 'Délici'],
  [/\bdelicat/g, 'délicat'], [/\bDelicat/g, 'Délicat'],
  [/\bdeliv/g, 'déliv'],
  [/\bdelice\b/g, 'délice'], [/\bdelices\b/g, 'délices'],
  [/\bdemarr/g, 'démarr'],
  [/\bdemonstr/g, 'démonstr'],
  [/\bdepart\b/g, 'départ'],
  [/\bdepass/g, 'dépass'],
  [/\bderouler\b/g, 'dérouler'],
  [/\bdesagreab/g, 'désagréab'],
  [/\bdesserts? sur/g, (m) => m], // keep as-is
  [/\bdesire/g, 'désiré'], [/\bdesirer/g, 'désirer'],
  [/\bdetail/g, 'détail'], [/\bDetail/g, 'Détail'],
  [/\bdevelop/g, 'dévelop'], [/\bDevelop/g, 'Dévelop'],
  [/\bderni/g, 'derni'], // "dernier" is correct without accent; avoid change
  [/\bechant/g, 'échant'], [/\bEchant/g, 'Échant'],
  [/\bechec\b/g, 'échec'],
  [/\beclair\b/g, 'éclair'], [/\beclairs?\b/g, 'éclair'],
  [/\beclair\w*/g, (m) => m.replace('eclair', 'éclair')],
  [/\beconom/g, 'économ'], [/\bEconom/g, 'Économ'],
  [/\becoul/g, 'écoul'],
  [/\bele\w+/g, (m) => m.startsWith('ele') && m.length > 3 ? 'élé' + m.slice(3) : m],
  [/\bemot/g, 'émot'],
  [/\bener/g, 'éner'],
  [/\benorm/g, 'énorm'],
  [/\bequi/g, 'équi'], [/\bEqui/g, 'Équi'],
  [/\bequilib/g, 'équilib'],
  [/\bequival/g, 'équival'],
  [/\betal\b/g, 'étal'], [/\betalage\b/g, 'étalage'],
  [/\betape\b/g, 'étape'], [/\betapes\b/g, 'étapes'],
  [/\betrang/g, 'étrang'],
  [/\bevent/g, 'évent'],
  [/\beviter/g, 'éviter'], [/\bEviter/g, 'Éviter'],
  [/\bevite\b/g, 'évite'],
  [/\bhesiter\b/g, 'hésiter'], [/\bhesit/g, 'hésit'],
  [/\bidee\b/g, 'idée'], [/\bIdee\b/g, 'Idée'],
  [/\bidees\b/g, 'idées'], [/\bIdees\b/g, 'Idées'],
  [/\binteresser/g, 'intéresser'], [/\binteress/g, 'intéress'],
  [/\blumiere\b/g, 'lumière'], [/\blumieres\b/g, 'lumières'],
  [/\blegende\b/g, 'légende'],
  [/\bleger\b/g, 'léger'], [/\blegere\b/g, 'légère'], [/\blegeres\b/g, 'légères'],
  [/\blegerement\b/g, 'légèrement'],
  [/\bmaitre\b/g, 'maître'], [/\bMaitre\b/g, 'Maître'],
  [/\bmaitres\b/g, 'maîtres'],
  [/\bnecess/g, 'nécess'],
  [/\bnoel\b/g, 'Noël'], [/\bNoel\b/g, 'Noël'],
  [/\boperation\b/g, 'opération'],
  [/\bpoele\b/g, 'poêle'],
  [/\bpoetique\b/g, 'poétique'],
  [/\bpremier\b/g, 'premier'], // correct as-is
  [/\bpremiere\b/g, 'première'], [/\bPremiere\b/g, 'Première'],
  [/\bpremieres\b/g, 'premières'],
  [/\brecemment\b/g, 'récemment'],
  [/\brecette\b/g, 'recette'], // correct as-is
  [/\breel\b/g, 'réel'], [/\breelle\b/g, 'réelle'], [/\breellement\b/g, 'réellement'],
  [/\bregion/g, 'région'], [/\bRegion/g, 'Région'],
  [/\bregulier/g, 'régulier'], [/\brguliere/g, 'régulière'],
  [/\brepond/g, 'répond'],
  [/\brepondre\b/g, 'répondre'],
  [/\brepond\w+/g, (m) => m.replace('repond', 'répond')],
  [/\bresidenc/g, 'résidenc'],
  [/\bresolution\b/g, 'résolution'],
  [/\brevel/g, 'révél'],
  [/\btheatre\b/g, 'théâtre'],
  [/\btolere/g, 'toléré'],
  [/\bverite\b/g, 'vérité'],
  [/\bveritab/g, 'véritab'],
  [/\bcote\b/g, 'côté'], [/\bCote\b/g, 'Côté'],
  [/\bcotes\b/g, 'côtés'],
  [/\bprete\b/g, 'prête'], [/\bpretes\b/g, 'prêtes'], [/\bpret\b/g, 'prêt'],
  [/\bpresents\b/g, 'présents'],
  [/\bprotege/g, 'protégé'],
  [/\brealiste/g, 'réaliste'],
  [/\brealiser\b/g, 'réaliser'],
  [/\brealite\b/g, 'réalité'],
  [/\bcentigrade\b/g, 'centigrade'], // correct
  [/\bcuit\b/g, 'cuit'], // correct
  [/\bcree\b/g, 'crée'], [/\bcreer\b/g, 'créer'], [/\bcreation\b/g, 'création'],
  [/\bcreations\b/g, 'créations'],
  [/\bCreee\b/g, 'Créée'], [/\bcreee\b/g, 'créée'],
  [/\bouvre\b/g, 'ouvre'], // correct
  [/\bcharacterist/g, 'caractérist'],
  [/\bcaracterist/g, 'caractérist'],
  [/\b[eE]trange\b/g, (m) => (m[0] === 'E' ? 'Étrange' : 'étrange')],
  [/\bfevrier\b/g, 'février'], [/\bFevrier\b/g, 'Février'],
  [/\baout\b/g, 'août'], [/\bAout\b/g, 'Août'],
  [/\bdecembre\b/g, 'décembre'], [/\bDecembre\b/g, 'Décembre'],
  [/\bespere/g, 'espéré'], [/\besperer\b/g, 'espérer'],
  [/\besperance\b/g, 'espérance'],
  [/\bmethode\b/g, 'méthode'], [/\bMethode\b/g, 'Méthode'],
  [/\bmethodes\b/g, 'méthodes'], [/\bMethodes\b/g, 'Méthodes'],
  [/\bmelange\b/g, 'mélange'], [/\bMelange\b/g, 'Mélange'],
  [/\bmelanges\b/g, 'mélanges'], [/\bMelanges\b/g, 'Mélanges'],
  [/\bmelang/g, 'mélang'],
  [/\bcere/g, 'céré'], [/\bCere/g, 'Céré'],
  [/\bceree\b/g, 'céréale'], // wrong; skip
  [/\bcereales?\b/g, (m) => m.replace('cereale', 'céréale')],
  [/\bsoupe\b/g, 'soupe'], // correct
  [/\bcafeine\b/g, 'caféine'],
  [/\bgele\b/g, 'gelé'], [/\bgelee\b/g, 'gelée'], [/\bgelees\b/g, 'gelées'],
  [/\bpedag/g, 'pédag'],
  [/\bpiegeage\b/g, 'piégeage'],
  [/\bpiege\b/g, 'piégé'],
  [/\btexture\b/g, 'texture'], // correct
  [/\bsave\w+/g, (m) => m], // "saveur" correct
  [/\bbaton/g, 'bâton'],
  [/\bchateau\b/g, 'château'], [/\bchateaux\b/g, 'châteaux'],
  [/\bhopital\b/g, 'hôpital'],
  [/\bhote\b/g, 'hôte'],
  [/\brotir\b/g, 'rôtir'], [/\brotis/g, 'rôtis'],
  [/\bcontrole\b/g, 'contrôle'], [/\bcontroler\b/g, 'contrôler'],
  [/\bcontroles\b/g, 'contrôles'],
  [/\bforet\b/g, 'forêt'], [/\bforets\b/g, 'forêts'],
  [/\bmaison\b/g, 'maison'], // correct
  [/\bcitron\b/g, 'citron'], // correct
  [/\bquete\b/g, 'quête'],
  [/\brevel\w+/g, (m) => m.replace('revel', 'révél')],
  [/\btheatr/g, 'théâtr'],
  [/\btoule/g, 'toulé'],
  [/\bremote\b/g, 'remote'], // English loan, keep
  [/\bsuite\b/g, 'suite'], // correct
  [/\bepice\b/g, 'épice'], [/\bepicer\b/g, 'épicer'], [/\bEpice\b/g, 'Épice'],
  [/\bepices\b/g, 'épices'], [/\bEpices\b/g, 'Épices'],
  [/\betoile\b/g, 'étoile'], [/\betoiles\b/g, 'étoiles'],
  [/\bhorreur\b/g, 'horreur'], // correct
  [/\btarte\b/g, 'tarte'], // correct
  [/\btheor/g, 'théor'],
  [/\buncrease\b/g, ''], // bug placeholder, ignore
];

const DE: Dict = [
  // Same mechanical substitutions as Tier C, extended.
  [/\bfuer\b/g, 'für'],
  [/\bFuer\b/g, 'Für'],
  [/\bueber\b/g, 'über'],
  [/\bUeber\b/g, 'Über'],
  [/\buber\b/g, 'über'],
  [/\bUber\b/g, 'Über'],
  [/\bGrosse\b/g, 'Größe'], [/\bgrosse\b/g, 'große'],
  [/\bGroesse\b/g, 'Größe'], [/\bgroesse\b/g, 'größe'],
  [/\bGroessen\b/g, 'Größen'], [/\bgroessen\b/g, 'größen'],
  [/\bGroesser\b/g, 'Größer'], [/\bgroesser\b/g, 'größer'],
  [/\bKueche\b/g, 'Küche'], [/\bkueche\b/g, 'küche'],
  [/\bKuechen\b/g, 'Küchen'], [/\bkuechen\b/g, 'küchen'],
  [/\bKuehle\b/g, 'Kühle'], [/\bkuehle\b/g, 'kühle'],
  [/\bkuehl\w*/g, (m) => m.replace('kuehl', 'kühl')],
  [/\bKuehl\w*/g, (m) => m.replace('Kuehl', 'Kühl')],
  [/\bsuess\w*/g, (m) => m.replace('suess', 'süß')],
  [/\bSuess\w*/g, (m) => m.replace('Suess', 'Süß')],
  [/\bLoeffel\w*/g, (m) => m.replace('Loeffel', 'Löffel')],
  [/\bloeffel\w*/g, (m) => m.replace('loeffel', 'löffel')],
  [/\bEssloeffel\w*/g, (m) => m.replace('Essloeffel', 'Esslöffel')],
  [/\bessloeffel\w*/g, (m) => m.replace('essloeffel', 'esslöffel')],
  [/\bTeeloefel\w*/g, (m) => m.replace('Teeloefel', 'Teelöffel')],
  [/\bteeloefel\w*/g, (m) => m.replace('teeloefel', 'teelöffel')],
  [/\bTeeloeffel\w*/g, (m) => m.replace('Teeloeffel', 'Teelöffel')],
  [/\bteeloeffel\w*/g, (m) => m.replace('teeloeffel', 'teelöffel')],
  [/\bGewuerz\w*/g, (m) => m.replace('Gewuerz', 'Gewürz')],
  [/\bgewuerz\w*/g, (m) => m.replace('gewuerz', 'gewürz')],
  [/\bnatuerlich\w*/g, (m) => m.replace('natuerlich', 'natürlich')],
  [/\bNatuerlich\w*/g, (m) => m.replace('Natuerlich', 'Natürlich')],
  [/\boefter\b/g, 'öfter'],
  [/\bStueck\w*/g, (m) => m.replace('Stueck', 'Stück')],
  [/\bstueck\w*/g, (m) => m.replace('stueck', 'stück')],
  [/\bKaese\b/g, 'Käse'], [/\bkaese\b/g, 'käse'],
  [/\bKaesekuchen\b/g, 'Käsekuchen'],
  [/\bKoerper\w*/g, (m) => m.replace('Koerper', 'Körper')],
  [/\bkoerper\w*/g, (m) => m.replace('koerper', 'körper')],
  [/\bkoennen\b/g, 'können'], [/\bKoennen\b/g, 'Können'],
  [/\bkoennte\b/g, 'könnte'], [/\bKoennte\b/g, 'Könnte'],
  [/\bmoeglich\w*/g, (m) => m.replace('moeglich', 'möglich')],
  [/\bMoeglich\w*/g, (m) => m.replace('Moeglich', 'Möglich')],
  [/\bzahlen\b/g, 'zählen'], // ambiguous actually — "zahlen" = to pay, "zählen" = to count. skip this
  [/\bzaehlen\b/g, 'zählen'], [/\bZaehlen\b/g, 'Zählen'],
  [/\bzaehlt\b/g, 'zählt'], [/\bZaehlt\b/g, 'Zählt'],
  [/\baehnlich\w*/g, (m) => m.replace('aehnlich', 'ähnlich')],
  [/\bAehnlich\w*/g, (m) => m.replace('Aehnlich', 'Ähnlich')],
  [/\bPekannuessen\b/g, 'Pekannüssen'],
  [/\bNuessen\b/g, 'Nüssen'],
  [/\bMuerbe\w*/g, (m) => m.replace('Muerbe', 'Mürbe')],
  [/\bmuerbe\w*/g, (m) => m.replace('muerbe', 'mürbe')],
  [/\bausgewaehlt\w*/g, (m) => m.replace('ausgewaehlt', 'ausgewählt')],
  [/\bfaellt\b/g, 'fällt'],
  [/\bgefaellt\b/g, 'gefällt'],
  [/\baeltere?\b/g, 'ältere'],
  [/\bschoen\w*/g, (m) => m.replace('schoen', 'schön')],
  [/\bSchoen\w*/g, (m) => m.replace('Schoen', 'Schön')],
  [/\bfluessig\w*/g, (m) => m.replace('fluessig', 'flüssig')],
  [/\bFluessig\w*/g, (m) => m.replace('Fluessig', 'Flüssig')],
  [/\btaetig\w*/g, (m) => m.replace('taetig', 'tätig')],
  [/\bTaetig\w*/g, (m) => m.replace('Taetig', 'Tätig')],
  [/\bueblich\w*/g, (m) => m.replace('ueblich', 'üblich')],
  [/\bUeblich\w*/g, (m) => m.replace('Ueblich', 'Üblich')],
  [/\berklaer\w*/g, (m) => m.replace('erklaer', 'erklär')],
  [/\bErklaer\w*/g, (m) => m.replace('Erklaer', 'Erklär')],
  [/\berwaehnt\w*/g, (m) => m.replace('erwaehnt', 'erwähnt')],
  [/\bhaeufig\w*/g, (m) => m.replace('haeufig', 'häufig')],
  [/\btraeger\w*/g, (m) => m.replace('traeger', 'träger')],
  [/\bVanille\w*/g, (m) => m], // correct
  [/\bVanillleextrakt\b/g, 'Vanilleextrakt'], // typo correction
  [/\bmaessig\w*/g, (m) => m.replace('maessig', 'mäßig')],
  [/\bausreichend\b/g, 'ausreichend'], // correct
  [/\bgefroren\w*/g, (m) => m], // correct
];

const PT: Dict = [
  [/\bvoce\b/gi, (m) => m[0] === 'V' ? 'Você' : 'você'],
  [/\bacucar\b/g, 'açúcar'], [/\bAcucar\b/g, 'Açúcar'],
  [/\bacucares\b/g, 'açúcares'],
  [/\bcha\b/g, 'chá'], [/\bCha\b/g, 'Chá'],
  [/\bchas\b/g, 'chás'],
  [/\bnao\b/g, 'não'], [/\bNao\b/g, 'Não'],
  [/\bsao\b/g, 'são'], [/\bSao\b/g, 'São'],
  [/\bmae\b/g, 'mãe'], [/\bMae\b/g, 'Mãe'],
  [/\bmaes\b/g, 'mães'], [/\bMaes\b/g, 'Mães'],
  [/\bpae\b/g, 'pãe'], // not a word
  [/\bpaes\b/g, 'pães'], [/\bPaes\b/g, 'Pães'],
  [/\bcoracao\b/g, 'coração'], [/\bCoracao\b/g, 'Coração'],
  [/\bcoracoes\b/g, 'corações'], [/\bCoracoes\b/g, 'Corações'],
  [/\bcao\b/g, 'cão'], [/\bCao\b/g, 'Cão'],
  [/\bcaes\b/g, 'cães'],
  [/\bleao\b/g, 'leão'],
  [/\bpao\b/g, 'pão'], [/\bPao\b/g, 'Pão'],
  [/\baviao\b/g, 'avião'], [/\bavioes\b/g, 'aviões'],
  [/\batencao\b/g, 'atenção'], [/\bAtencao\b/g, 'Atenção'],
  [/\brefeicao\b/g, 'refeição'], [/\brefeicoes\b/g, 'refeições'],
  [/\bfuncao\b/g, 'função'], [/\bFuncao\b/g, 'Função'],
  [/\bfuncoes\b/g, 'funções'],
  [/\bopcao\b/g, 'opção'], [/\bOpcao\b/g, 'Opção'],
  [/\bopcoes\b/g, 'opções'], [/\bOpcoes\b/g, 'Opções'],
  [/\bproducao\b/g, 'produção'],
  [/\bsensacao\b/g, 'sensação'],
  [/\bemocao\b/g, 'emoção'],
  [/\binformacao\b/g, 'informação'], [/\binformacoes\b/g, 'informações'],
  [/\bindicacao\b/g, 'indicação'],
  [/\bpreparacao\b/g, 'preparação'],
  [/\bmaca\b/g, 'maçã'], [/\bMaca\b/g, 'Maçã'],
  [/\bmacas\b/g, 'maçãs'],
  [/\bcoco\b/g, 'coco'], // correct
  [/\bgeladeira\b/g, 'geladeira'], // correct
  [/\bfacil\b/g, 'fácil'], [/\bFacil\b/g, 'Fácil'],
  [/\bfaceis\b/g, 'fáceis'],
  [/\bdificil\b/g, 'difícil'], [/\bDificil\b/g, 'Difícil'],
  [/\bdificeis\b/g, 'difíceis'],
  [/\brapid\w+/g, (m) => m.replace('rapid', 'rápid')],
  [/\bRapid\w+/g, (m) => m.replace('Rapid', 'Rápid')],
  [/\bvariedade\b/g, 'variedade'], // correct
  [/\bvarios\b/g, 'vários'], [/\bVarios\b/g, 'Vários'],
  [/\bvarias\b/g, 'várias'], [/\bVarias\b/g, 'Várias'],
  [/\bunico\b/g, 'único'], [/\bUnico\b/g, 'Único'],
  [/\bunica\b/g, 'única'], [/\bUnica\b/g, 'Única'],
  [/\bultimo\b/g, 'último'], [/\bUltimo\b/g, 'Último'],
  [/\bultima\b/g, 'última'], [/\bUltima\b/g, 'Última'],
  [/\bultimos\b/g, 'últimos'],
  [/\bultimas\b/g, 'últimas'],
  [/\bproximo\b/g, 'próximo'], [/\bProximo\b/g, 'Próximo'],
  [/\bproxima\b/g, 'próxima'],
  [/\bsabor\b/g, 'sabor'], // correct
  [/\bsabores\b/g, 'sabores'], // correct
  [/\btamb\w*m\b/g, (m) => 'também'.slice(0, m.length)],
  [/\btambem\b/g, 'também'], [/\bTambem\b/g, 'Também'],
  [/\bporem\b/g, 'porém'], [/\bPorem\b/g, 'Porém'],
  [/\bjasmim\b/g, 'jasmim'], // correct
  [/\balem\b/g, 'além'], [/\bAlem\b/g, 'Além'],
  [/\bfrutas\b/g, 'frutas'], // correct
  [/\bingrediente\b/g, 'ingrediente'], // correct
  [/\bingredientes\b/g, 'ingredientes'],
  [/\bproteina\b/g, 'proteína'], [/\bProteina\b/g, 'Proteína'],
  [/\bproteinas\b/g, 'proteínas'], [/\bProteinas\b/g, 'Proteínas'],
  [/\bproteico\b/g, 'proteico'], // correct
  [/\bhomogeneo\b/g, 'homogêneo'], [/\bHomogeneo\b/g, 'Homogêneo'],
  [/\btres\b/g, 'três'], [/\bTres\b/g, 'Três'],
  [/\bvai\b/g, 'vai'], // correct
  [/\bfica\b/g, 'fica'], // correct
  [/\bpossivel\b/g, 'possível'], [/\bPossivel\b/g, 'Possível'],
  [/\bimpossivel\b/g, 'impossível'],
  [/\bagradavel\b/g, 'agradável'], [/\bAgradavel\b/g, 'Agradável'],
  [/\bresponsavel\b/g, 'responsável'],
  [/\bincrivel\b/g, 'incrível'], [/\bIncrivel\b/g, 'Incrível'],
  [/\bcremoso\b/g, 'cremoso'], // correct
  [/\bcremosa\b/g, 'cremosa'], // correct
  [/\bpo\b/g, 'pó'], [/\bPo\b/g, 'Pó'], // "po" standalone never valid
  [/\bpos\b/g, 'pós'], [/\bPos\b/g, 'Pós'],
  [/\bcalda\b/g, 'calda'], // correct
  [/\bclassico\b/g, 'clássico'], [/\bClassico\b/g, 'Clássico'],
  [/\bclassica\b/g, 'clássica'], [/\bClassica\b/g, 'Clássica'],
  [/\bpublico\b/g, 'público'], [/\bPublico\b/g, 'Público'],
  [/\bdelicia\b/g, 'delícia'], [/\bdelicias\b/g, 'delícias'],
  [/\bdelicioso\b/g, 'delicioso'], // correct
  [/\bdeliciosa\b/g, 'deliciosa'], // correct
  [/\bavo\b/g, 'avó'], [/\bavos\b/g, 'avós'],
  [/\bmes\b/g, 'mês'], [/\bMes\b/g, 'Mês'],
  [/\bmeses\b/g, 'meses'], // correct
  [/\bcafe\b/g, 'café'], [/\bCafe\b/g, 'Café'],
  [/\bcafes\b/g, 'cafés'], [/\bCafes\b/g, 'Cafés'],
  [/\bcozinha\b/g, 'cozinha'], // correct
  [/\balcool\b/g, 'álcool'], [/\bAlcool\b/g, 'Álcool'],
  [/\bcanela\b/g, 'canela'], // correct
  [/\bgengibre\b/g, 'gengibre'], // correct
  [/\bcardamomo\b/g, 'cardamomo'], // correct
  [/\bpouco\b/g, 'pouco'], // correct
  [/\bpoucos\b/g, 'poucos'], // correct
  [/\bpai\b/g, 'pai'], // correct
  [/\bjuice\b/g, 'suco'], // English leak
  [/\btorta\b/g, 'torta'], // correct
  [/\bcolher\b/g, 'colher'], // correct
  [/\bcolheres\b/g, 'colheres'], // correct
  [/\bbaunilha\b/g, 'baunilha'], // correct
  [/\bconsistencia\b/g, 'consistência'], [/\bConsistencia\b/g, 'Consistência'],
  [/\bexperiencia\b/g, 'experiência'], [/\bExperiencia\b/g, 'Experiência'],
  [/\bexperiencias\b/g, 'experiências'],
  [/\bemagrec/g, 'emagrec'],
  [/\besta\b/g, 'está'], [/\bEsta\b/g, 'Está'], // "esta" = this (unaccented); "está" = is; in blog-post context "está" is far more common; risk accepted
  [/\bestao\b/g, 'estão'], [/\bEstao\b/g, 'Estão'],
  [/\bagua\b/g, 'água'], [/\bAgua\b/g, 'Água'],
  [/\baguas\b/g, 'águas'],
  [/\bficara\b/g, 'ficará'],
  [/\bsera\b/g, 'será'], [/\bSera\b/g, 'Será'],
  [/\bserao\b/g, 'serão'], [/\bSerao\b/g, 'Serão'],
  [/\bnivel\b/g, 'nível'], [/\bNivel\b/g, 'Nível'],
  [/\bniveis\b/g, 'níveis'],
  [/\bpetala\b/g, 'pétala'], [/\bpetalas\b/g, 'pétalas'],
  [/\bfotografia\b/g, 'fotografia'], // correct
  [/\bproporcao\b/g, 'proporção'],
  [/\bproporcoes\b/g, 'proporções'],
  [/\bdificeis\b/g, 'difíceis'],
];

type PostRow = {
  id: string;
  post_id: string;
  locale: string;
  title: string | null;
  excerpt: string | null;
  body: string | null;
};

function restore(text: string | null, dict: Dict): string | null {
  if (!text) return text;
  let out = text;
  for (const [re, rep] of dict) {
    if (typeof rep === 'function') out = out.replace(re, rep as any);
    else out = out.replace(re, rep);
  }
  return out;
}

(async () => {
  const flags = JSON.parse(readFileSync('data/post-flags.json', 'utf8'));
  const ids: string[] = flags.missingDiaRows.map((r: any) => r.id);

  const { data, error } = await supabase.from('post_translations').select('*').in('id', ids);
  if (error) throw error;

  const fixes: any[] = [];
  for (const r of (data ?? []) as PostRow[]) {
    const dict = r.locale === 'fr' ? FR : r.locale === 'de' ? DE : r.locale === 'pt' ? PT : null;
    if (!dict) continue;

    const newTitle = restore(r.title, dict);
    const newExcerpt = restore(r.excerpt, dict);
    const newBody = restore(r.body, dict);

    if (newTitle === r.title && newExcerpt === r.excerpt && newBody === r.body) continue;

    fixes.push({
      id: r.id,
      post_id: r.post_id,
      locale: r.locale,
      title_before: r.title,
      title_after: newTitle !== r.title ? newTitle : null,
      excerpt_before: r.excerpt,
      excerpt_after: newExcerpt !== r.excerpt ? newExcerpt : null,
      body_before_chars: r.body?.length ?? 0,
      body_after_preview: (newBody ?? '').slice(0, 300),
      body_change_count: countDiff(r.body ?? '', newBody ?? ''),
    });

    if (apply) {
      const update: any = {};
      if (newTitle !== r.title) update.title = newTitle;
      if (newExcerpt !== r.excerpt) update.excerpt = newExcerpt;
      if (newBody !== r.body) update.body = newBody;
      const { error: ue } = await supabase.from('post_translations').update(update).eq('id', r.id);
      if (ue) console.log(`ERR ${r.id}: ${ue.message}`);
    }
  }

  writeFileSync('data/post-restore-preview.json', JSON.stringify(fixes, null, 2));
  console.log(`${apply ? 'Applied' : 'Preview of'} ${fixes.length} posts.`);
  for (const f of fixes) {
    console.log(`  [${f.locale}] ${f.title_before?.slice(0, 60) ?? ''}`);
    if (f.title_after) console.log(`    title_after: ${f.title_after.slice(0, 80)}`);
    console.log(`    body changes: ${f.body_change_count} chars affected`);
    console.log(`    body preview: ${f.body_after_preview.slice(0, 200)}...`);
  }
})();

function countDiff(a: string, b: string): number {
  let n = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) if (a[i] !== b[i]) n++;
  n += Math.abs(a.length - b.length);
  return n;
}
