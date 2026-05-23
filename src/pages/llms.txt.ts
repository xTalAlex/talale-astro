import type { APIRoute } from "astro";
import GeneralConfig from "@src/config/general.json";
import FreelanceConfig from "@src/config/freelance.json";
import { rawContent as llmsContextMarkdown } from "@src/data/markdown/llms-context.md";
import { stripHtml, formatPrice } from "@src/lib/utils.js";

export const prerender = true;

export const GET: APIRoute = () => {
  const siteUrl = GeneralConfig.url;

  const services = FreelanceConfig.prices
    .map((p) => {
      const features = p.features.map((f) => `  - ${f}`).join("\n");
      return `### ${p.name} — da ${formatPrice(p)}\n${p.description}\n${features}`;
    })
    .join("\n\n");

  const baseFeatures = FreelanceConfig.features
    .map((f) => `- **${f.title}**: ${f.description}`)
    .join("\n");

  const stack = FreelanceConfig.frameworks.map((f) => `- [${f.name}](${f.url})`).join("\n");

  const supportServices = FreelanceConfig.supportServices
    .map((s) => `- ${s.name}`)
    .join("\n");

  const faq = FreelanceConfig.faq
    .map((q) => `### ${q.question}\n${q.answer}`)
    .join("\n\n");

  const address = `${GeneralConfig.address.streetAddress}, ${GeneralConfig.address.postalCode} ${GeneralConfig.address.addressLocality} (${GeneralConfig.address.addressRegion}), ${GeneralConfig.address.addressCountry}`;

  const body = `# ${GeneralConfig.title} — ${siteUrl}

> ${GeneralConfig.motto}

${stripHtml(GeneralConfig.description)}

${llmsContextMarkdown().trim()}

- Area servita: ${GeneralConfig.areaServed.join(", ")}.

## Servizi e Pacchetti

${services}

## Cosa è incluso nei progetti

${baseFeatures}

## Servizi di assistenza continuativa

${supportServices}

## Stack tecnico

${stack}

## Contatti

- Email: [${GeneralConfig.email}](mailto:${GeneralConfig.email})
- WhatsApp: [scrivimi su WhatsApp](${GeneralConfig.waUrl})
- Prenota una call: [Google Calendar](${GeneralConfig.googleCalendar.url})
- Sede: ${address}
- Maps: [${GeneralConfig.googleMaps.title}](${GeneralConfig.googleMaps.url})
- GitHub: [${GeneralConfig.social.github}](${GeneralConfig.social.github})
- P.IVA: ${FreelanceConfig.piva}

## FAQ

${faq}

## Risorse

- [Sito web](${siteUrl})
- [Blog](${siteUrl}${GeneralConfig.blog.url})
`;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
