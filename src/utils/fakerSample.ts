// Use dynamic import to avoid CommonJS require() trying to load an ESM-only package
// This keeps the module compatible when tests are loaded under CommonJS
export async function getDemoOutput(): Promise<string> {
  const mod = await import("@faker-js/faker");
  const { faker } = mod as any;
  return faker.person.fullName();
}

// Promise-based export for convenience (callers can await this)
export const demoOutputPromise = getDemoOutput();

// Example usage elsewhere:
// const name = await getDemoOutput();
