export const masksPatterns = {
  d: { pattern: new RegExp('[a-zA-Z0-9ñÑáéíóúüÁÉÍÓÚÜ,.\\-_\\s]*$') },
  a: { pattern: new RegExp('[a-zA-Z0-9ñÑáéíóúüÁÉÍÓÚÜ\\s]') },
  n: { pattern: new RegExp('[a-zA-ZñÑáéíóúüÁÉÍÓÚÜ\\s]'), optional: true },
  i: { pattern: new RegExp('[a-zA-Z0-9ñÑáéíóúüÁÉÍÓÚÜ]'), optional: true }, // Solo permite numeros y letras, sin espacios.
  f: { pattern: new RegExp('[0-9]+([,|.][0-9]+)?$'), optional: true }, // Solo permite numeros y decimales
  b: { pattern: new RegExp('[0-9]') }, // Solo permite numeros
  e: { pattern: new RegExp('[a-zA-ZñÑáéíóúüÁÉÍÓÚÜ,.;()\\-_\\s]+$') },
  c: { pattern: new RegExp('([a-zA-Z0-9ñÑáéíóúüÁÉÍÓÚÜ,.;:""}{z><?¡¿#()\\-_\\s]+$)')},
  m: { pattern: new RegExp('[a-zA-Z0-9ñÑ\\s]+') }, // Solo permite letras (a-z) y numeros
  l: { pattern: new RegExp('[a-zA-Z0-9ñÑ.\\s]+') } // Solo permite letras (a-z), (0-9), (.)


};
