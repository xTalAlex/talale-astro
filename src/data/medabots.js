/**
 * 
 * https://www.youtube.com/embed/${video_id}
 * 
 */

const episodes = [
    {
        season: 1,
        number: 1,
        title: "Un vecchio Medarot all'attacco",
        video_id: "UW09qDDEspQ",
        summary: null
    },
    {
        season: 1,
        number: 2,
        title: "La sconfitta degli Screw",
        video_id: "ow5Y0fhTLWE",
        summary: null
    },
    {
        season: 1,
        number: 3,
        title: "Un professore davvero straordinario",
        video_id: "miw4u5thWCk",
        summary: null
    },
    {
        season: 1,
        number: 4,
        title: "Il leggendario master dei Medarot",
        video_id: "CFjgftuhkT0",
        summary: null
    },
    {
        season: 1,
        number: 5,
        title: "Grazie grande oceano",
        video_id: "mExCfyQ07M4",
        summary: null
    },
    {
        season: 1,
        number: 6,
        title: "L'arrivo dei robot alieni",
        video_id: "ZwpQkfWZB90",
        summary: null
    },
    {
        season: 1,
        number: 7,
        title: "Il medal scomparso",
        video_id: "TLi8_KlNNaQ",
        summary: null
    },
    {
        season: 1,
        number: 8,
        title: "Il Medarot perduto",
        video_id: "IvMlZoevQEA",
        summary: null
    },
    {
        season: 1,
        number: 9,
        title: "Siandog in campo",
        video_id: "9E7URWTKEZ4",
        summary: null
    },
    {
        season: 1,
        number: 10,
        title: "Lo strepitoso torneo Robotol",
        video_id: "S44iP8fQuwU",
        summary: null
    },
    {
        season: 1,
        number: 11,
        title: "Metabee se ne va",
        video_id: "HHNxW3yHU-4",
        summary: null
    },
    {
        season: 1,
        number: 12,
        title: "Il mio nome è Rockshow",
        video_id: "Ah3JG03rpuQ",
        summary: null
    },
    {
        season: 1,
        number: 13,
        title: "Un amore per Samantha",
        video_id: "nvvfj01NXXI",
        summary: null
    },
    {
        season: 1,
        number: 14,
        title: "I ninja sono qui",
        video_id: "53jiUkEreYw",
        summary: null
    },
    {
        season: 1,
        number: 15,
        title: "State attenti a Kintaro",
        video_id: "2li3kcG1J_Q",
        summary: null
    },
    {
        season: 1,
        number: 16,
        title: "Il linguaggio dei fiori",
        video_id: "s0LzjcZmaLs",
        summary: null,
    },
    {
        season: 1,
        number: 17,
        title: "Retort in pericolo",
        video_id: "eVaH7ExfO98",
        summary: null,
    },
    {
        season: 1,
        number: 18,
        title: "I combattimenti sono proibiti",
        video_id: "MrkjcCgOy5c",
        summary: null,
    },
    {
        season: 1,
        number: 19,
        title: "Pingen si dirige a sud",
        video_id: "AaYLnss0eRk",
        summary: null,
    }, 
    {
        season: 1,
        number: 20,
        title: "Alla ricerca dei Rari Medal",
        video_id: "DfdY82V474g",
        summary: null,
    }, 
    {
        season: 1,
        number: 21,
        title: "La Medarot Corporation",
        video_id: "Y-L0vkAAPuo",
        summary: null,
    },
    {
        season: 1,
        number: 22,
        title: "Vola, Metabee!",
        video_id: "2iIWp7YBx7E",
        summary: null,
    },
    {
        season: 1,
        number: 23,
        title: "Memorie di vento e di fuoco",
        video_id: "IBK5SkGO_cY",
        summary: null,
    },
    {
        season: 1,
        number: 24,
        title: "Robattle party",
        video_id: "kN3DPROwBDI",
        summary: null,
    },
    {
        season: 1,
        number: 25,
        title: "Metabee contro Rockshow",
        video_id: "LArPPbmTMkY",
        summary: null,
    },
    {
        season: 1,
        number: 26,
        title: "Medaforza in azione",
        video_id: "sOg_0jzAUlU",
        summary: null,
    },
    {
        season: 1,
        number: 27,
        title: "Fresco di stampa, la classifica nazionale",
        video_id: "SN0I0W4q8HU",
        summary: null,
    },
    {
        season: 1,
        number: 28,
        title: "Il piano dello gnocco di polpo",
        video_id: "j8I_swR8f6w",
        summary: null,
    },
    {
        season: 1,
        number: 29,
        title: "È arrivato l'uomo della neve",
        video_id: "AP8hVHcENDg",
        summary: null,
    },
    {
        season: 1,
        number: 30,
        title: "Cane randagio",
        video_id: "2urhReJoziQ",
        summary: null,
    },
    {
        season: 1,
        number: 31,
        title: "Ecco Rinato",
        video_id: "Nr143rDvAaI",
        summary: null,
    },
    {
        season: 1,
        number: 32,
        title: "Un messaggio dallo spazio",
        video_id: "htVpiaxf5dE",
        summary: null,
    },
    {
        season: 1,
        number: 33,
        title: "Un ponte per i combattimenti robotol",
        video_id: "t1zp6DWzn7E",
        summary: null,
    },
    {
        season: 1,
        number: 34,
        title: "Il segreto della spada fantasma",
        video_id: "zK_BHC98rPA",
        summary: null,
    },
    {
        season: 1,
        number: 35,
        title: "Mamma è stata rapita",
        video_id: "kejHFzwp8Yw",
        summary: null,
    },
    {
        season: 1,
        number: 36,
        title: "Arrivederci Master Spaziale X",
        video_id: "vU-tX9t2dJ8",
        summary: null,
    },
    {
        season: 1,
        number: 37,
        title: "La battaglia finale alle Rovine di Miyama",
        video_id: "sqEbaGX1HhA",
        summary: null,
    },
    {
        season: 1,
        number: 38,
        title: "In soccorso di Metabee",
        video_id: "SboTXKwdh1I",
        summary: null,
    },
    {
        season: 1,
        number: 39,
        title: "La feroce robattle finale",
        video_id: "1d9XGCi0hKc",
        summary: null,
    },
    {
        season: 1,
        number: 40,
        title: "Iniziano i campionati del mondo",
        video_id: "0d5DH8eDwhY",
        summary: null,
    },
    {
        season: 1,
        number: 41,
        title: "Il primo combattimento",
        video_id: "0Cz9-QVpSKY",
        summary: null,
    },
    {
        season: 1,
        number: 42,
        title: "I tre fratelli Lupin",
        video_id: "8uAuEZptRpI",
        summary: null,
    },
    {
        season: 1,
        number: 43,
        title: "Il master danzante",
        video_id: "RIfQn3LA85M",
        summary: null,
    },
    {
        season: 1,
        number: 44,
        title: "Attenti agli idoli!",
        video_id: "DlR_ma8CTgI",
        summary: null,
    },
    {
        season: 1,
        number: 45,
        title: "La potente regina d'Egitto",
        video_id: "Xnzl0GxXvAQ",
        summary: null,
    },
    {
        season: 1,
        number: 46,
        title: "Lo spettacolare Joe",
        video_id: "4CydJDNHn-U",
        summary: null,
    },
    {
        season: 1,
        number: 47,
        title: "Il ragazzo che veniva dal Nord",
        video_id: "S3LtTFK3y8w",
        summary: null,
    },
    {
        season: 1,
        number: 48,
        title: "Il leone solitario",
        video_id: "42YGdZsJvNs",
        summary: null,
    },
    {
        season: 1,
        number: 49,
        title: "La fnale della Coppa del Mondo",
        video_id: "iBg0CNj7od8",
        summary: null,
    },
    {
        season: 1,
        number: 50,
        title: "Un incubo che ritorna",
        video_id: "-D-fvTzS_J4",
        summary: null,
    },
    {
        season: 1,
        number: 51,
        title: "In un sogno",
        video_id: "DaxPDDRXVEs",
        summary: null,
    },
    {
        season: 1,
        number: 52,
        title: "La piú grande robattle del mondo",
        video_id: "xqWlM6VBeIs",
        summary: null,
    },
];

export  { episodes };