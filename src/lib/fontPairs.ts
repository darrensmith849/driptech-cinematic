// Three font pairings the LLM can pick per business feel. `display` + `sans` override
// the @theme font vars via :root; `href` is the Google Fonts stylesheet Layout injects.

export type FontPair = { display: string; sans: string; href: string };

export const fontPairs: Record<string, FontPair> = {
  jakarta_inter: {
    display: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
    sans: '"Inter", ui-sans-serif, system-ui, sans-serif',
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap',
  },
  fraunces_inter: {
    display: '"Fraunces", Georgia, serif',
    sans: '"Inter", ui-sans-serif, system-ui, sans-serif',
    href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&display=swap',
  },
  sora_inter: {
    display: '"Sora", ui-sans-serif, system-ui, sans-serif',
    sans: '"Inter", ui-sans-serif, system-ui, sans-serif',
    href: 'https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap',
  },
};
