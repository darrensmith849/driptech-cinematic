// Seven hand-tuned palettes. Each overrides the SAME CSS custom properties that
// global.css defines in @theme; Layout.astro injects the chosen one as :root{} so
// Tailwind's var()-based utilities recolour the whole site. The LLM (draftContent)
// PICKS a paletteKey per business category — it never invents hex values.

export type PaletteVars = Record<string, string>;

const keys = [
  '--color-ink-100', '--color-ink-700', '--color-ink-800', '--color-ink-900', '--color-ink-950',
  '--color-primary-50', '--color-primary-100', '--color-primary-500', '--color-primary-600', '--color-primary-700',
  '--color-accent-400', '--color-accent-500', '--color-accent-600', '--color-accent-700',
  '--color-surface-50', '--color-surface-100', '--color-surface-200',
] as const;

const make = (...vals: string[]): PaletteVars =>
  Object.fromEntries(keys.map((k, i) => [k, vals[i]!]));

export const palettes: Record<string, PaletteVars> = {
  // ink×5, primary×5, accent×4, surface×3
  ocean: make(
    '#cdddec', '#123a58', '#0e2c43', '#0b2233', '#071624',
    '#eef6fc', '#d6ebf8', '#2f86c2', '#236aa3', '#1d5580',
    '#edbc55', '#e0a92e', '#c48e1e', '#9c7016',
    '#f6f9fb', '#edf3f8', '#dde9f0',
  ),
  forest: make(
    '#d3e4d8', '#14432a', '#0f3320', '#0b2618', '#06180f',
    '#eef7f1', '#d6ecdd', '#2f9e5b', '#217e46', '#1a6339',
    '#e6c168', '#d3a63f', '#b3852a', '#8c6820',
    '#f5f9f6', '#ecf4ee', '#dce9e0',
  ),
  warm: make(
    '#ecdcd3', '#4a2f22', '#38241a', '#291a12', '#180e09',
    '#fdf2ee', '#f9ded3', '#d1622f', '#b14a1e', '#8f3c19',
    '#f0b03e', '#e0972a', '#bd7a1d', '#955f18',
    '#faf6f2', '#f4ece4', '#ead9cb',
  ),
  mono: make(
    '#d9dee4', '#2b333d', '#1f262e', '#151a20', '#0b0e12',
    '#eff3f7', '#dbe4ee', '#3f6f9e', '#305880', '#274668',
    '#4bc0b0', '#2ba593', '#1f8577', '#1a6a5f',
    '#f7f8fa', '#eef1f4', '#e0e5ea',
  ),
  berry: make(
    '#ecd9e4', '#4a2038', '#38182b', '#29111f', '#180912',
    '#fdf1f6', '#f9dbe8', '#d24a86', '#b1356b', '#8f2b56',
    '#eec25f', '#dfa733', '#bd8622', '#96691b',
    '#faf5f7', '#f4eaef', '#ead6df',
  ),
  sun: make(
    '#d3dcec', '#1f3153', '#172640', '#101b30', '#08101d',
    '#fff6ec', '#fde7cb', '#ef9a2b', '#d07c1a', '#a86117',
    '#4aa8e0', '#2f8bc4', '#236ea3', '#1d5780',
    '#fbf8f3', '#f5efe4', '#ece0cc',
  ),
  slate: make(
    '#d8dee7', '#2c3746', '#202834', '#161c25', '#0c1016',
    '#eef1fb', '#dae1f6', '#4f63d2', '#3c4db0', '#313f8e',
    '#38b6c9', '#2497aa', '#1c7887', '#185f6b',
    '#f7f8fb', '#eef1f6', '#e0e5ee',
  ),
};
