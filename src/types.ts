export interface Document {
  id: string;
  title: string;
  content: string;
  lastModified: number;
}

export interface PreviewStyles {
  fontFamily: string;
  headingFontFamily: string;
  baseFontSize: number;
  headingScale: number;
}

export const DEFAULT_STYLES: PreviewStyles = {
  fontFamily: 'Inter, sans-serif',
  headingFontFamily: 'Inter, sans-serif',
  baseFontSize: 16,
  headingScale: 1.2,
};
