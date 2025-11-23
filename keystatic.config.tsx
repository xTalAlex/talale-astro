import { config, fields, collection, singleton } from "@keystatic/core";

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
      Settings: ["general", "freelance"],
    },
  },

  collections: {
    projects: collection({
      label: "Progetti",
      slugField: "title",
      path: "src/content/projects/*",
      format: { contentField: "content" },
      columns: ["pubDate", "thumb"],
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
        email: fields.text({
          label: "Email",
          validation: {
            isRequired: true,
          },
        }),
        waUrl: fields.url({
          label: "Whatsapp URL",
        }),
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
      },
    }),
  },
});
