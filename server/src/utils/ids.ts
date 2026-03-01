export function parseNumericId(raw: string): number {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid numeric id");
  }
  return id;
}
