export function osmHref(lat: number, lng: number, zoom = 6) {
  const z = Math.min(18, Math.max(1, zoom));
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${z}/${lat}/${lng}`;
}

export function osmEmbedSrc(lat: number, lng: number, zoom = 6) {
  const z = Math.min(18, Math.max(1, zoom));
  const delta = 1.2 / Math.max(1, z / 4);
  const left = lng - delta;
  const right = lng + delta;
  const top = lat + delta;
  const bottom = lat - delta;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lng}`;
}
