export function updateTheme(theme) {
  console.log('??? updateTheme', theme);
  document.body.setAttribute('theme-mode', theme.toLowerCase());
}