export const regexType = {
    default: {
        exp: '^[a-zA-Z0-9ñÑáéíóúüÁÉÍÓÚÜ,.\\-_\\s]*$',
        message: 'Formato inválido, no use caracteres especiales'
    },
    word: {
        exp: '^[a-zA-Z0-9ñÑáéíóúüÁÉÍÓÚÜ,.\\-_]*$',
        message: 'Formato inválido, no use caracteres especiales ni espacios'
    },
    name: {
        exp: '^[a-zA-ZñÑáéíóúüÁÉÍÓÚÜ\\s]*$',
        message: 'Formato inválido, no use caracteres especiales'
    },
    alphanumberWord: {
        exp: '^[a-zA-Z0-9]*$',
        message: 'Formato alfanúmerico inválido'
    },
    charWord: {
        exp: '^[a-zA-Z]*$',
        message: 'Formato de caracteres inválido'
    },
    anyWord: {
        exp: '^\\S*$',
        message: 'Formato inválido'
    },
    percent: {
        exp: '^100$|^[0-9]{1,2}$|^[0-9]{1,2}\\.[0-9]{1,2}$',
        message: 'Formato de porcentaje inválido, use el punto decimal (.)'
    },
    email: {
        exp: '[^@]+@[^\.]+\..+$',
        message: 'Formato de e-mail inválido'
    },
    number: {
        exp: '^[0-9]*$',
        message: 'Formato de número inválido'
    },
    time24: {
        exp: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$',
        message: 'Formato de hora militar inválido, use 23:45'
    },
    date: {
        exp: '^[0-9]{1,2}/[0-9]{1,2}/[0-9]{4}$',
        message: 'Formato de fecha inválido',
        internal: 'dd/mm/yyyy'
    },
    password: {
        exp: '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$',
        message: 'La contraseña debe incluir una longitud mínima de 8 caracteres, una letra mayúscula, una letra minúscula, un número, un carácter especial (@#$%^&+=/.) y no debe tener espacios.'
    }
};
