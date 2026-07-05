export function detectLangFromText(text) {
  for (const char of text) {
    const code = char.codePointAt(0);
    if (code >= 0x0e01 && code <= 0x0e59) {
      return "th";
    }
  }
  return "en";
}

export function normalizeLang(value) {
  const lang = value.toLowerCase().trim();
  if (lang === "thai") {
    return "th";
  }
  if (lang === "english") {
    return "en";
  }
  if (lang !== "th" && lang !== "en") {
    return lang ? "th" : "";
  }
  return lang;
}
