const CURRENCY_FORMATTER = new Intl.NumberFormat(undefined, {
    currency: "RUB",
    style: "currency",
})
  
function formatCurrency(number: number) {
    return CURRENCY_FORMATTER.format(number)
}

export default formatCurrency;