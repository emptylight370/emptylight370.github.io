// 在页面加载后读取颜色偏好，并切换
window.addEventListener("load", () => {
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const color = window.__inside__.color;
  let currentColor;
  if (color.length === 1) {
    currentColor = "day";
  } else if (color.length === 2) {
    currentColor = "night";
  }
  const button = document.querySelector("i.φda");
  if (
    (isDark && currentColor === "day") ||
    (!isDark && currentColor === "night")
  ) {
    button.click();
  }
});
