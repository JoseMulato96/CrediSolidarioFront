import { CurrencyMaskInputMode } from 'ngx-currency';

export const percentMaskConfig = {
    align: 'left',
    allowNegative: false,
    allowZero: true,
    decimal: ',',
    precision: 2,
    prefix: '',
    suffix: ' %',
    thousands: '.',
    nullable: true,
    min: null,
    max: null,
    inputMode: CurrencyMaskInputMode.NATURAL
};

export const currencyMaskConfig = {
    align: 'left',
    allowNegative: false,
    allowZero: true,
    decimal: ',',
    precision: 2,
    prefix: '$ ',
    suffix: '',
    thousands: '.',
    nullable: true,
    min: null,
    max: null,
    inputMode: CurrencyMaskInputMode.NATURAL
};

export const numberMaskConfig = {
    align: 'left',
    allowNegative: false,
    allowZero: true,
    decimal: ',',
    precision: 2,
    prefix: '',
    suffix: '',
    thousands: '.',
    nullable: true,
    min: null,
    max: null,
    inputMode: CurrencyMaskInputMode.NATURAL,    
};


export const numberMaskConfigPlanes = {
    align: 'left',
    allowNegative: false,
    allowZero: true,
    decimal: ',',
    precision: 2,
    prefix: '',
    suffix: '',
    thousands: '.',
    nullable: true,
    min: null,
    max: 9999999999.99,
    inputMode: CurrencyMaskInputMode.NATURAL,    
};