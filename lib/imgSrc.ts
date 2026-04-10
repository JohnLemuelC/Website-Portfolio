const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
export const imgSrc = (name: string) => `${BASE}/images/${name}`;
