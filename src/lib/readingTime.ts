/** Nombre de mots (hors syntaxe Markdown), pour le temps de lecture. */
export function countWords(source: string) {
  const text = source.replace(/```[\s\S]*?```/g, ' ').replace(/[#>*_`[\]()!-]/g, ' ');
  return text.split(/\s+/).filter(Boolean).length;
}

export const readingMinutes = (source: string) => Math.max(1, Math.round(countWords(source) / 200));
