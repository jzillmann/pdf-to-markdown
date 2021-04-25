enum FontType {
  BOLD = 'BOLD',
  OBLIQUE = 'OBLIQUE',
  //TODO remove bold/oblique
  BOLD_OBLIQUE = 'BOLD_OBLIQUE',
}

export default FontType;

namespace FontType {
  export function declaredFontTypes(fontName: string): FontType[] {
    const fontNameLowerCase = fontName.toLowerCase();
    const bold = fontNameLowerCase.includes('bold') || fontNameLowerCase.includes('heavy');
    const italic = fontNameLowerCase.includes('oblique') || fontNameLowerCase.includes('italic');
    const fontTypes: FontType[] = [];
    if (bold) {
      fontTypes.push(FontType.BOLD);
    }
    if (italic) {
      fontTypes.push(FontType.OBLIQUE);
    }
    return fontTypes;
  }
}
