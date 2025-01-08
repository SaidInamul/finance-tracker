<script setup>
  import { transactionViewOptions } from '~/constants';
  import Trend from '~/components/trend.vue';

  const supabase = useSupabaseClient()
  const selectedView = ref(transactionViewOptions[0])
  const transactions = ref([])
  const isLoading = ref(false)
  const isOpen = ref(false)
  
  const fetchTransactions = async () => {
    isLoading.value = true
    try {
      const { data } = await useAsyncData('transactions', async () => {
        const { data, error } = await supabase.from('Transactions').select()
        
        if (error) {
          return []
        }
        // useAsyncData will return reactive data
        return data
      })
      return data.value

    } finally {
      isLoading.value = false
    }
  }
  
    const refreshTransactions = async () => transactions.value = await fetchTransactions()
    await refreshTransactions()

    // use reduce() to group the transaction based on date
    const transactionByDate = computed(() => {
      return transactions.value.reduce((acc, transaction) => {

      // Extract the date in YYYY-MM-DD format
      const dateKey = new Date(transaction.created_at).toISOString().split("T")[0]

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

</script>

<template>
    <section class="flex items-center justify-between mb-10">
    <h1 class="text-xl font-extrabold">
      Summary
    </h1>
    <div>
      <USelectMenu :options="transactionViewOptions" v-model="selectedView" />
    </div>
  </section>

  <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10">
    <Trend color="green" title="Income" :amount="totalIncome" :last-amount="1000" :loading="isLoading" />
    <Trend color="red" title="Expense" :amount="totalExpense" :last-amount="600" :loading="isLoading" />
    <Trend color="green" title="Investments" :amount="4000" :last-amount="3000" :loading="isLoading" />
    <Trend color="red" title="Saving" :amount="4000" :last-amount="4100" :loading="isLoading" />
  </section>

  <section class="flex justify-between">
    <div>
      <h2 class="text-2xl font-extrabold">Transactions</h2>
      <div class="text-gray-500 dark:text-gray-400">
        You have {{ incomeType.length }} incomes and {{ expenseType.length }} expenses this period
      </div>
    </div>
    <div>
      <!-- <TransactionModal v-model="isOpen" @saved="refresh()" /> -->
      <UButton icon="i-heroicons-plus-circle" color="white" variant="solid" label="Add" @click="isOpen = true" />
      <TransactionModal v-model="isOpen"/>
    </div>
  </section>

  <section v-if="!isLoading">
    <div v-for="(transactionOnDay, date) in transactionByDate" :key="date" class="mb-10">
      <DailyTransaction :transactions="transactionOnDay" :date="date"/>
      <TransactionTest
        v-for="transaction in transactionOnDay"
        :key="transaction.id"
        :transaction="transaction"
        @deleted="refreshTransactions()"/>
    </div>
  </section>

  <section v-else>
    <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
  </section>
</template>