import FontType from 'src/FontType';

test('descriptive names', async () => {
  expect(FontType.declaredFontTypes('')).toEqual([]);
  expect(FontType.declaredFontTypes('JBRMKS+Helvetica')).toEqual([]);
  expect(FontType.declaredFontTypes('OMUGKQ+Helvetica-Bold')).toEqual([FontType.BOLD]);
  expect(FontType.declaredFontTypes('SVUOCV+Helvetica-Oblique')).toEqual([FontType.OBLIQUE]);
  expect(FontType.declaredFontTypes('JUJONH+Helvetica-BoldOblique')).toEqual([FontType.BOLD, FontType.OBLIQUE]);
});

// See http://mirrors.ibiblio.org/CTAN/systems/win32/bakoma/fonts/fonts.html
test('ATM Compatible Postscript Type 1', async () => {
  expect(FontType.declaredFontTypes('')).toEqual([]);
  expect(FontType.declaredFontTypes('BBXMCN+CMR9')).toEqual([]);
  expect(FontType.declaredFontTypes('EFUEQI+CMR10')).toEqual([]);
  expect(FontType.declaredFontTypes('JZXNAL+CMCSC10')).toEqual([]);
  expect(FontType.declaredFontTypes('ZYSMDY+CMBX10')).toEqual([FontType.BOLD]);
  expect(FontType.declaredFontTypes('AENRCE+CMBX12')).toEqual([FontType.BOLD]);
  expect(FontType.declaredFontTypes('HENPPA+BitstreamCyberbit-Roman')).toEqual([]);
  expect(FontType.declaredFontTypes('GHPDYG+CMSY10')).toEqual([]);
  expect(FontType.declaredFontTypes('VKLUIG+CMTT9')).toEqual([]);
  expect(FontType.declaredFontTypes('KSVJZ+CMTI10')).toEqual([FontType.OBLIQUE]);
  expect(FontType.declaredFontTypes('QCQOVJ+CMTT10')).toEqual([]);
  expect(FontType.declaredFontTypes('ASZLVZ+BitstreamCyberbit-Roman')).toEqual([]);
  expect(FontType.declaredFontTypes('KFYFQJ+CMMI10')).toEqual([FontType.OBLIQUE]);
  expect(FontType.declaredFontTypes('GYUWCJ+CMMIB10')).toEqual([FontType.BOLD, FontType.OBLIQUE]);
  expect(FontType.declaredFontTypes('OUVHFK+CMR8')).toEqual([]);
});
