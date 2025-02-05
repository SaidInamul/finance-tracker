
export const useCurrency = (amount, unit) => {

  const currency = computed(() => {
    const currencyUnit = isRef(unit) ? unit.value : unit
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currencyUnit ? currencyUnit : 'MYR'
    }).format(isRef(amount) ? amount.value : amount)
  })
  
    return {
      currency
    }
  }