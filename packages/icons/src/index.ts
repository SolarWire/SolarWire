export interface IconLibrary {
  name: string;
  getIcon: (name: string, size: number, color: string) => string;
}

const iconLibraries = new Map<string, IconLibrary>();

export function registerIconLibrary(library: IconLibrary): void {
  iconLibraries.set(library.name, library);
}

export function getIconLibrary(name: string): IconLibrary | undefined {
  return iconLibraries.get(name);
}

export function getAllIconLibraries(): IconLibrary[] {
  return Array.from(iconLibraries.values());
}

export function renderIcon(
  name: string,
  size: number,
  color: string,
  libraryName: string = 'material-icons'
): string {
  const library = getIconLibrary(libraryName);
  if (library) {
    return library.getIcon(name, size, color);
  }
  return createDefaultIcon(name, size, color);
}

function createDefaultIcon(name: string, size: number, color: string): string {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 4;
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}"/>`;
}

const materialIcons: IconLibrary = {
  name: 'material-icons',
  getIcon: (name: string, size: number, color: string) => {
    const svgMap: Record<string, string> = {
      'star': `<polygon points="${size/2},${size*0.1} ${size*0.85},${size*0.38} ${size*0.68},${size*0.9} ${size*0.32},${size*0.9} ${size*0.15},${size*0.38}" fill="${color}"/>`,
      'home': `<path d="M${size*0.1} ${size*0.4} L${size/2} ${size*0.1} L${size*0.9} ${size*0.4} L${size*0.9} ${size*0.9} L${size*0.1} ${size*0.9} Z" fill="${color}"/>`,
      'lock': `<rect x="${size*0.25}" y="${size*0.45}" width="${size*0.5}" height="${size*0.4}" rx="${size*0.05}" fill="${color}"/><rect x="${size*0.35}" y="${size*0.25}" width="${size*0.3}" height="${size*0.25}" rx="${size*0.1}" fill="none" stroke="${color}" stroke-width="${size*0.08}"/>`,
      'search': `<circle cx="${size*0.4}" cy="${size*0.4}" r="${size*0.25}" fill="none" stroke="${color}" stroke-width="${size*0.08}"/><line x1="${size*0.58}" y1="${size*0.58}" x2="${size*0.85}" y2="${size*0.85}" stroke="${color}" stroke-width="${size*0.08}"/>`,
      'check': `<polyline points="${size*0.2},${size*0.55} ${size*0.45},${size*0.8} ${size*0.8},${size*0.3}" fill="none" stroke="${color}" stroke-width="${size*0.1}" stroke-linecap="round" stroke-linejoin="round"/>`,
      'close': `<line x1="${size*0.25}" y1="${size*0.25}" x2="${size*0.75}" y2="${size*0.75}" stroke="${color}" stroke-width="${size*0.1}" stroke-linecap="round"/><line x1="${size*0.75}" y1="${size*0.25}" x2="${size*0.25}" y2="${size*0.75}" stroke="${color}" stroke-width="${size*0.1}" stroke-linecap="round"/>`,
      'menu': `<line x1="${size*0.15}" y1="${size*0.3}" x2="${size*0.85}" y2="${size*0.3}" stroke="${color}" stroke-width="${size*0.08}" stroke-linecap="round"/><line x1="${size*0.15}" y1="${size*0.5}" x2="${size*0.85}" y2="${size*0.5}" stroke="${color}" stroke-width="${size*0.08}" stroke-linecap="round"/><line x1="${size*0.15}" y1="${size*0.7}" x2="${size*0.85}" y2="${size*0.7}" stroke="${color}" stroke-width="${size*0.08}" stroke-linecap="round"/>`,
      'arrow-back': `<polyline points="${size*0.6},${size*0.25} ${size*0.3},${size*0.5} ${size*0.6},${size*0.75}" fill="none" stroke="${color}" stroke-width="${size*0.1}" stroke-linecap="round" stroke-linejoin="round"/>`,
      'arrow-forward': `<polyline points="${size*0.4},${size*0.25} ${size*0.7},${size*0.5} ${size*0.4},${size*0.75}" fill="none" stroke="${color}" stroke-width="${size*0.1}" stroke-linecap="round" stroke-linejoin="round"/>`,
      'edit': `<path d="M${size*0.2} ${size*0.8} L${size*0.15} ${size*0.95} L${size*0.3} ${size*0.9} L${size*0.8} ${size*0.35} L${size*0.65} ${size*0.2} Z" fill="${color}"/>`
    };
    
    return svgMap[name] || createDefaultIcon(name, size, color);
  }
};

const fontAwesome: IconLibrary = {
  name: 'font-awesome',
  getIcon: (name: string, size: number, color: string) => {
    const svgMap: Record<string, string> = {
      'star': `<polygon points="${size/2},${size*0.1} ${size*0.85},${size*0.38} ${size*0.68},${size*0.9} ${size*0.32},${size*0.9} ${size*0.15},${size*0.38}" fill="${color}"/>`,
      'home': `<path d="M${size*0.1} ${size*0.4} L${size/2} ${size*0.1} L${size*0.9} ${size*0.4} L${size*0.9} ${size*0.9} L${size*0.1} ${size*0.9} Z" fill="${color}"/>`,
      'lock': `<rect x="${size*0.25}" y="${size*0.45}" width="${size*0.5}" height="${size*0.4}" rx="${size*0.05}" fill="${color}"/><rect x="${size*0.35}" y="${size*0.25}" width="${size*0.3}" height="${size*0.25}" rx="${size*0.1}" fill="none" stroke="${color}" stroke-width="${size*0.08}"/>`,
      'search': `<circle cx="${size*0.4}" cy="${size*0.4}" r="${size*0.25}" fill="none" stroke="${color}" stroke-width="${size*0.08}"/><line x1="${size*0.58}" y1="${size*0.58}" x2="${size*0.85}" y2="${size*0.85}" stroke="${color}" stroke-width="${size*0.08}"/>`,
      'check': `<polyline points="${size*0.2},${size*0.55} ${size*0.45},${size*0.8} ${size*0.8},${size*0.3}" fill="none" stroke="${color}" stroke-width="${size*0.1}" stroke-linecap="round" stroke-linejoin="round"/>`,
      'times': `<line x1="${size*0.25}" y1="${size*0.25}" x2="${size*0.75}" y2="${size*0.75}" stroke="${color}" stroke-width="${size*0.1}" stroke-linecap="round"/><line x1="${size*0.75}" y1="${size*0.25}" x2="${size*0.25}" y2="${size*0.75}" stroke="${color}" stroke-width="${size*0.1}" stroke-linecap="round"/>`,
      'bars': `<line x1="${size*0.15}" y1="${size*0.3}" x2="${size*0.85}" y2="${size*0.3}" stroke="${color}" stroke-width="${size*0.08}" stroke-linecap="round"/><line x1="${size*0.15}" y1="${size*0.5}" x2="${size*0.85}" y2="${size*0.5}" stroke="${color}" stroke-width="${size*0.08}" stroke-linecap="round"/><line x1="${size*0.15}" y1="${size*0.7}" x2="${size*0.85}" y2="${size*0.7}" stroke="${color}" stroke-width="${size*0.08}" stroke-linecap="round"/>`,
      'arrow-left': `<polyline points="${size*0.6},${size*0.25} ${size*0.3},${size*0.5} ${size*0.6},${size*0.75}" fill="none" stroke="${color}" stroke-width="${size*0.1}" stroke-linecap="round" stroke-linejoin="round"/>`,
      'arrow-right': `<polyline points="${size*0.4},${size*0.25} ${size*0.7},${size*0.5} ${size*0.4},${size*0.75}" fill="none" stroke="${color}" stroke-width="${size*0.1}" stroke-linecap="round" stroke-linejoin="round"/>`,
      'pencil': `<path d="M${size*0.2} ${size*0.8} L${size*0.15} ${size*0.95} L${size*0.3} ${size*0.9} L${size*0.8} ${size*0.35} L${size*0.65} ${size*0.2} Z" fill="${color}"/>`,
      'heart': `<path d="M${size*0.5} ${size*0.85} L${size*0.2} ${size*0.45} Q${size*0.1} ${size*0.25} ${size*0.3} ${size*0.2} Q${size*0.5} ${size*0.15} ${size*0.5} ${size*0.35} Q${size*0.5} ${size*0.15} ${size*0.7} ${size*0.2} Q${size*0.9} ${size*0.25} ${size*0.8} ${size*0.45} Z" fill="${color}"/>`,
      'user': `<circle cx="${size*0.5}" cy="${size*0.35}" r="${size*0.2}" fill="${color}"/><path d="M${size*0.15} ${size*0.9} Q${size*0.15} ${size*0.6} ${size*0.5} ${size*0.6} Q${size*0.85} ${size*0.6} ${size*0.85} ${size*0.9}" fill="${color}"/>`,
      'cog': `<circle cx="${size*0.5}" cy="${size*0.5}" r="${size*0.3}" fill="${color}"/><circle cx="${size*0.5}" cy="${size*0.5}" r="${size*0.12}" fill="white"/>`
    };
    
    return svgMap[name] || createDefaultIcon(name, size, color);
  }
};

registerIconLibrary(materialIcons);
registerIconLibrary(fontAwesome);

export { materialIcons, fontAwesome };
