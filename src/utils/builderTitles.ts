export const BUILDER_TITLES = [
  "Ship-It Architect",
  "Backend Wizard",
  "Pixel Pusher",
  "Code Nomad",
  "Product Hacker",
  "API Alchemist",
  "Bug Hunter",
  "Build Mode: ON",
  "Weekend Hacker",
  "Systems Wizard",
  "Fullstack Fanatic",
  "Database Deity",
  "UI Artisan",
  "Coffee-to-Code Converter",
  "10x Deployer"
];

export function getRandomTitle(): string {
  const randomIndex = Math.floor(Math.random() * BUILDER_TITLES.length);
  return BUILDER_TITLES[randomIndex];
}

export function getRandomTitleDifferentThan(current: string): string {
  const filtered = BUILDER_TITLES.filter(title => title !== current);
  if (filtered.length === 0) return current;
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}
