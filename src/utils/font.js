export const createFont = async () => {
  const webFontLoader = await import('webfontloader')

  webFontLoader.load({
    google: {
      api: 'https://fonts.googleapis.com/css2',
      families: ['Poppins:wght@300;400;500;600;700;900&display=swap'],
    },
  })
}
