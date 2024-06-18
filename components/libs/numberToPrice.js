export const numberToPrice = (number) =>
    number ? `${number?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}` : 0
