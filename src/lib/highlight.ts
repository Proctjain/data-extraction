// Tiny JSON syntax highlighter -> HTML string with semantic token classes.
export function highlightJson(value: unknown): string {
  const json = JSON.stringify(value, null, 2)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return json.replace(
    /("(\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let cls = "text-code-number";
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? "text-code-key" : "text-code-string";
      } else if (/true|false|null/.test(match)) {
        cls = "text-code-number";
      }
      return `<span class="${cls}">${match}</span>`;
    },
  );
}
