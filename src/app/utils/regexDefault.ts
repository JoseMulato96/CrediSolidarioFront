export const regexType = {
  default: {
    exp: "^[a-zA-Z0-9ñÑáéíóúüÁÉÍÓÚÜ,.\\-_\\s]*$",
    message: "Formato inválido, no use caracteres especiales."
  },

  word: {
    exp: "^[a-zA-Z0-9ñÑáéíóúüÁÉÍÓÚÜ,.\\-_]*$",
    message: "Formato inválido, no use caracteres especiales ni espacios."
  },
  alphanumberWord: {
    exp: "^[a-zA-Z0-9]*$",
    message: "Formato alfanúmerico inválido."
  },
  charWord: {
    exp: "^[a-zA-Z]*$",
    message: "Formato de caracteres inválido."
  },
  anyWord: {
    exp: "^\\S*$",
    message: "Formato inválido."
  },
  percent: {
    exp: "^100$|^[0-9]{1,2}$|^[0-9]{1,2}\\.[0-9]{1,2}$",
    message: "Formato de porcentaje inválido, use el punto decimal (.)"
  },
  email: {
    exp: "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$",
    message: "Formato de e-mail inválido."
  },

  emailCargado: {
    exp: "",
    message: "Formato de e-mail inválido."
  },
  number: {
    exp: "^[0-9]*$",
    message: "Formato de número inválido."
  },
  numberracional: {
    exp: "^[0-9]+([.][0-9]+)?$",
    message: "Formato de número inválido."
  },
  currency: {
    exp: "^[0-9]+([,|.][0-9]+)?$",
    message: "Formato de número inválido."
  },
  heightperson: {
    exp: "^[0-9]{1}([.][0-9]{1,3})?$",
    message: "Formato de estatura es inválido."
  },
  weightperson: {
    exp: "^[0-9]{1,3}([.][0-9]{1,3})?$",
    message: "Formato de estatura es inválido."
  },
  phone: {
    exp: /^([0-9]{7}$|[0-9]{7}$)/,
    message: "Formato de teléfono inválido, debe tener 7 números"
  },
  phoneMobil: {
    exp: "^([0-9]{7}$|[0-9]{10}$)",
    message: "Formato de teléfono inválido, debe estar entre 7 o 10 números"
  },
  time24: {
    exp: "^([01]?[0-9]|2[0-3]):[0-5][0-9]$",
    message: "Formato de hora militar inválido, use 23:45"
  }
};
