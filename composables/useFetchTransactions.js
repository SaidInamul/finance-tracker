export const useFetchTransactions = (period) => {
    const supabase = useSupabaseClient()
    const transactions = ref([])
    const pending = ref(false)

    // get transactions
    const getTransactions = async () => {
        pending.value = true
        try {
          const { data } = await useAsyncData(`transactions-${period.value.from.toDateString()}-${period.value.to.toDateString()}`, async () => {
            const { data, error } = await supabase.from('transactions')
            .select()
            .gte('created_at', period.value.from.toISOString())
            .lte('created_at', period.value.to.toISOString())
            .order('created_at', {ascending: false})
            
            if (error) {
              return []
            }
            // useAsyncData will return reactive data
            return data
          })
          return data.value
    
        } finally {
          pending.value = false
        }
    }

    // refresh transactions
    const refresh = async () => transactions.value = await getTransactions()
    watch(period, async () => await refresh())

    // use reduce() to group the transaction based on date
    const transactionByDate = computed(() => {
        return transactions.value.reduce((acc, transaction) => {
  
        // Extract the date in YYYY-MM-DD format
        const dateKey = transaction.created_at.split("T")[0]
  
        // Check if the dateKey already exists in the accumulator
        if (!acc[dateKey]) {
          acc[dateKey] = [] // Dynamically create an array for the date if it doesn't exist
        }
  
        // Add the transaction to the corresponding date group
        acc[dateKey].push(transaction)
  
        // Return the updated accumulator
        return acc
        }, {}) // Start with an empty object
    })

    const incomeType = computed(() => {
        return transactions.value.filter((transaction) => transaction.type === 'Income')
    })
  
    const expenseType = computed(() => {
        return transactions.value.filter((transaction) => transaction.type === 'Expense')
    })
  
    const totalIncome = computed(() => {
        return incomeType.value.reduce((acc, income) => {
          acc += income.amount
  
          return acc
        }, 0)
    })
  
    const totalExpense = computed(() => {
        return expenseType.value.reduce((acc, expense) => {
          acc += expense.amount
  
          return acc
        }, 0)
    })

    return {
        pending,
        income : incomeType,
        expense : expenseType,
        totalIncome,
        totalExpense,
        refresh,
        byDate : transactionByDate
    }
}