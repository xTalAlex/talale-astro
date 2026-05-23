import { config, fields, collection, singleton } from "@keystatic/core";

const pixelartIconDescription = (
  <>
    <a href="https://icon-sets.iconify.design/pixelarticons/?keyword=pixel"
       target="_blank" rel="noreferrer">pixelarticons</a>
  </>
);

export default config({
  storage: import.meta.env.DEV
    ? { kind: "local" }
    : { kind: "github", repo: "xTalAlex/talale-astro" },

  ui: {
    brand: {
      name: "talale.it Admin",
      mark: () => (
        <img src={"/icon.png"} height={24} style={{ borderRadius: "100%" }} />
      ),
    },
    navigation: {
      Content: ["projects"],
      Settings: ["general", "freelance", "llmsContext", "ads"],
    },
  },

  collections: {
    projects: collection({
      label: "Progetti",
      slugField: "title",
      path: "src/content/projects/*",
      format: { contentField: "content" },
      columns: ["pubDate"],
      // entryLayout: "content",
      schema: {
        title: fields.slug({
          name: {
            label: "Titolo",
            validation: { isRequired: true },
          },
        }),
        link: fields.url({
          label: "Link",
          validation: { isRequired: true },
        }),
        thumb: fields.image({
          label: "Thumb",
          directory: "public/uploads",
          publicPath: "/uploads/",
          validation: { isRequired: true },
        }),
        description: fields.text({
          label: "Descrizione",
          multiline: true,
          validation: { isRequired: true },
        }),
        pubDate: fields.datetime({
          label: "Data pubblicazione",
          validation: { isRequired: true },
        }),
        portfolio: fields.checkbox({
          label: "Portfolio",
          defaultValue: false,
        }),
        featured: fields.checkbox({
          label: "Featured",
          defaultValue: false,
        }),
        gallery: fields.array(
          fields.image({
            label: "Immagine",
            directory: "public/uploads",
            publicPath: "/uploads/",
          }),
          {
            label: "Galleria",
          },
        ),
        content: fields.markdoc({
          label: "Content",
          extension: "md",
        }),
      },
    }),
  },

  singletons: {
    general: singleton({
      label: "Impostazioni Generali",
      path: "src/config/general",
      format: { data: "json" },
      schema: {
        url: fields.url({
          label: "URL",
        }),
        title: fields.text({
          label: "Titolo",
        }),
        subtitle: fields.text({
          label: "Sottotitolo",
        }),
        motto: fields.text({
          label: "Motto",
        }),
        description: fields.text({
          label: "Descrizione",
          multiline: true,
        }),
        cta: fields.text({
          label: "CTA",
        }),
        biography: fields.text({
          label: "Biografia",
          multiline: true,
        }),
        jobTitle: fields.text({
          label: "Ruolo professionale",
          description: "Es. Sviluppatore Web Freelance. Usato per JSON-LD e llms.txt.",
        }),
        birthYear: fields.integer({
          label: "Anno di nascita",
          description: "Usato come birthDate nello schema Person (JSON-LD).",
        }),
        email: fields.text({
          label: "Email",
          validation: {
            isRequired: true,
          },
        }),
        waUrl: fields.url({
          label: "Whatsapp URL",
        }),
        address: fields.object(
          {
            streetAddress: fields.text({
              label: "Indirizzo",
              description: "Via e numero civico",
            }),
            addressLocality: fields.text({
              label: "Città",
            }),
            addressRegion: fields.text({
              label: "Provincia",
              description: "Sigla a 2 lettere (es. VA)",
            }),
            postalCode: fields.text({
              label: "CAP",
            }),
            addressCountry: fields.text({
              label: "Paese",
              description: "Codice ISO a 2 lettere (es. IT)",
            }),
          },
          {
            label: "Sede",
            description: "Indirizzo della sede, usato per JSON-LD e llms.txt.",
          },
        ),
        geo: fields.object(
          {
            latitude: fields.number({
              label: "Latitudine",
            }),
            longitude: fields.number({
              label: "Longitudine",
            }),
          },
          {
            label: "Coordinate geografiche",
            description: "Usate per lo schema GeoCoordinates (JSON-LD).",
          },
        ),
        areaServed: fields.array(
          fields.text({ label: "Area" }),
          {
            label: "Aree servite",
            description: "Elenco delle aree geografiche servite.",
            itemLabel: (props) => props.value,
          },
        ),
        social: fields.object(
          {
            github: fields.url({
              label: "GitHub",
            }),
          },
          {
            label: "Social",
            description: "Profili social, usati come sameAs nel JSON-LD.",
          },
        ),
        googleMaps: fields.object(
          {
            title: fields.text({
              label: "Title",
            }),
            url: fields.url({
              label: "URL",
            }),
          },
          {
            label: "Google Maps",
            description: "Impostazioni per l'integrazione Google Maps",
          },
        ),
        googleCalendar: fields.object(
          {
            url: fields.url({
              label: "URL",
            }),
            cta: fields.text({
              label: "CTA",
            }),
          },
          {
            label: "Google Calendar",
            description:
              "Impostazioni per il bottone di prenotazione calendario",
          },
        ),
        zight: fields.object({
          requestLink: fields.url({
            label: "Request Link",
          }),
        }),
        messagebox: fields.object(
          {
            placeholder: fields.text({
              label: "Placeholder",
            }),
            success: fields.text({
              label: "Conferma",
            }),
            error: fields.text({
              label: "Errore",
            }),
          },
          {
            label: "Messagebox",
            description: "Testi per il form di contatto",
          },
        ),
        blog: fields.object(
          {
            url: fields.url({
              label: "URL",
            }),
            category: fields.text({
              label: "Categoria",
            }),
          },
          {
            label: "Blog",
            description: "Impostazioni per l'integrazione del blog esterno",
          },
        ),
        igdb: fields.object(
          {
            console: fields.text({
              label: "Console",
            }),
            dateFromNMonths: fields.integer({
              label: "Offset Data (Da)",
              description: "Numero di mesi rispetto alla data di deploy",
            }),
            dateToNMonths: fields.integer({
              label: "Offset Data (A)",
              description: "Numero di mesi rispetto alla data di deploy",
            }),
            gamesPerPage: fields.integer({
              label: "Giochi per Pagina",
              validation: { min: 1 },
            }),
          },
          {
            label: "IGDB",
            description: "Impostazioni per la sezione giochi Nintendo Switch",
          },
        ),
        netlifyStatusBadgeUrl: fields.url({
          label: "Deploy Status Badge URL",
          description: "Netlify deploy status badge URL",
        }),
      },
    }),

    llmsContext: singleton({
      label: "Contesto per LLM",
      path: "src/data/markdown/llms-context",
      format: { contentField: "content" },
      entryLayout: "content",
      schema: {
        content: fields.markdoc({
          label: "Contenuto",
          extension: "md",
          description:
            "Copy editoriale incluso in llms.txt: posizionamento, cliente ideale, contesto per LLM e motori AI.",
        }),
      },
    }),

    ads: singleton({
      label: "Google Ads",
      path: "src/data/ads",
      format: { data: "json" },
      schema: {
        categories: fields.array(
          fields.object({
            name: fields.text({
              label: "Nome categoria",
              validation: { isRequired: true },
            }),
            description: fields.text({
              label: "Descrizione",
              multiline: true,
            }),
            keywords: fields.text({
              label: "Keywords",
              description:
                "Una keyword per riga. Usa le virgolette per la corrispondenza a frase (\"keyword\") o le parentesi quadre per quella esatta ([keyword]). Pronto per copia/incolla nella textarea di Google Ads.",
              multiline: true,
            }),
          }),
          {
            label: "Gruppi di keywords",
            itemLabel: (props) => props.fields.name.value || "Categoria",
          },
        ),
      },
    }),

    freelance: singleton({
      label: "Freelance",
      path: "src/config/freelance",
      format: { data: "json" },
      schema: {
        piva: fields.text({
          label: "PIva",
        }),
        prices: fields.array(
          fields.object({
            name: fields.text({
              label: "Nome",
            }),
            description: fields.text({
              label: "Descrizione",
            }),
            info: fields.text({
              label: "Info",
            }),
            amount: fields.number({
              label: "Cifra",
              defaultValue: 0,
            }),
            amountInfo: fields.text({
              label: "Informazioni Cifra",
            }),
            plus: fields.checkbox({
              label: "Prezzo base",
              defaultValue: false,
            }),
            features: fields.array(
              fields.text({
                label: "Feature",
              }),
              {
                label: "Features",
                itemLabel: (props) => props.value || "Feature",
              },
            ),
            includesBaseServices: fields.checkbox({
              label: "Include servizi base",
              defaultValue: false,
            }),
            supportMonthsIncluded: fields.integer({
              label: "Mesi di manutenzioni inclusi",
              defaultValue: 0,
            }),
          }),
          {
            label: "Prezzi",
            itemLabel: (props) => props.fields.name.value || "Prezzo",
            validation: { length: { min: 3, max: 3 } },
          },
        ),
        supportServices: fields.array(
          fields.object({
            name: fields.text({
              label: "Nome",
            }),
            icon: fields.text({
              label: "Icona",
              description: pixelartIconDescription,
            }),
          }),
          {
            label: "Servizi di assistenza",
            itemLabel: (props) => props.fields.name.value || "Servizio",
            validation: { length: { min: 6, max: 6 } },
          },
        ),
        frameworks: fields.array(
          fields.object({
            name: fields.text({
              label: "Nome",
            }),
            logo: fields.image({
              label: "Logo",
              directory: "public/uploads",
              publicPath: "/uploads/",
            }),
            url: fields.url({
              label: "URL",
            }),
          }),
          {
            label: "Frameworks",
            itemLabel: (props) => props.fields.name.value || "Framework",
          },
        ),
        features: fields.array(
          fields.object({
            title: fields.text({
              label: "Titolo",
            }),
            shortLabel: fields.text({
              label: "Etichetta breve",
              description:
                "Versione sintetica del titolo usata nei tag della sezione Restyling.",
            }),
            highlightInRestyling: fields.checkbox({
              label: "Mostra nella sezione Restyling",
              defaultValue: false,
            }),
            description: fields.text({
              label: "Descrizione",
              multiline: true,
            }),
          }),
          {
            label: "Features",
            itemLabel: (props) => props.fields.title.value || "Feature",
          },
        ),
        faq: fields.array(
          fields.object({
            question: fields.text({
              label: "Domanda",
            }),
            answer: fields.text({
              label: "Risposta",
              multiline: true,
            }),
          }),
          {
            label: "FAQ",
            itemLabel: (props) => props.fields.question.value || "Domanda",
          },
        ),
        redFlags: fields.array(
          fields.object({
            icon: fields.text({
              label: "Icona",
              description: pixelartIconDescription,
            }),
            title: fields.text({
              label: "Titolo",
            }),
            description: fields.text({
              label: "Descrizione",
              multiline: true,
            }),
          }),
          {
            label: "Red Flags",
            description:
              "Segnali che indicano la necessità di un restyling del sito",
            itemLabel: (props) => props.fields.title.value || "Red Flag",
          },
        ),
      },
    }),
  },
});
