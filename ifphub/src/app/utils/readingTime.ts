const DEFAULT_WPM = 200;

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, " ");

const normalizeText = (value: string) =>
  stripHtml(value)
    .replace(/\s+/g, " ")
    .trim();

const countWords = (value: string) => {
  const normalized = normalizeText(value);
  if (!normalized) return 0;
  return normalized.split(" ").length;
};

type ReadingTimeOptions = {
  wpm?: number;
  minMinutes?: number;
};

export const estimateReadingTime = (
  value?: string | null,
  options: ReadingTimeOptions = {}
) => {
  const wpm = options.wpm ?? DEFAULT_WPM;
  const minMinutes = options.minMinutes ?? 1;
  const words = countWords(value ?? "");

  if (!words) return minMinutes;
  return Math.max(minMinutes, Math.ceil(words / wpm));
};
