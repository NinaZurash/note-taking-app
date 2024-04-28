export function darkenColor(color: string): string {
  // Convert the color to RGB values
  const hex = color.slice(1);
  const rgb = parseInt(hex, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = rgb & 0xff;

  // Calculate the darker color by reducing the RGB values
  const darkerR = Math.max(0, r - 90);
  const darkerG = Math.max(0, g - 90);
  const darkerB = Math.max(0, b - 90);

  // Convert the darker RGB values back to hex
  const darkerHex = ((darkerR << 16) | (darkerG << 8) | darkerB).toString(16);

  // Pad the hex value with zeros if necessary
  const paddedHex = "#" + ("000000" + darkerHex).slice(-6);

  return paddedHex;
}

export const BADGE_COLORS = [
  { bgColor: "#e0ffcd", textColor: darkenColor("#e0ffcd") },
  { bgColor: "#fdffcd", textColor: darkenColor("#fdffcd") },
  { bgColor: "#ffebbb", textColor: darkenColor("#ffebbb") },
  { bgColor: "#ffcab0", textColor: darkenColor("#ffcab0") },
  { bgColor: "#a2a8d3", textColor: darkenColor("#a2a8d3") },
  { bgColor: "#f7d7ff", textColor: darkenColor("#f7d7ff") },
  { bgColor: "#ffebf7", textColor: darkenColor("#ffebf7") },
  { bgColor: "#d7f7ff", textColor: darkenColor("#d7f7ff") },
  { bgColor: "#f7ffcd", textColor: darkenColor("#f7ffcd") },
  { bgColor: "#ffecd7", textColor: darkenColor("#ffecd7") },
  { bgColor: "#d7ffec", textColor: darkenColor("#d7ffec") },
  { bgColor: "#ecffd7", textColor: darkenColor("#ecffd7") },
  { bgColor: "#d7ecff", textColor: darkenColor("#d7ecff") },
  { bgColor: "#ffd7ec", textColor: darkenColor("#ffd7ec") },
  { bgColor: "#ecffcd", textColor: darkenColor("#ecffcd") },
  { bgColor: "#cdffec", textColor: darkenColor("#cdffec") },
  { bgColor: "#ecd7ff", textColor: darkenColor("#ecd7ff") },
  { bgColor: "#ffcdec", textColor: darkenColor("#ffcdec") },
  { bgColor: "#ecffeb", textColor: darkenColor("#ecffeb") },
  { bgColor: "#ebffcd", textColor: darkenColor("#ebffcd") },
];
