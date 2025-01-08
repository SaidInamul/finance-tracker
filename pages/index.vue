<script setup>
  import { transactionViewOptions } from '~/constants';
  import Trend from '~/components/trend.vue';

  const supabase = useSupabaseClient()
  const selectedView = ref(transactionViewOptions[0])
  const transactions = ref([])
  const isLoading = ref(false)
  
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
    <Trend color="green" title="Income" :amount="2000" :last-amount="1000" :loading="isLoading" />
    <Trend color="red" title="Expense" :amount="500" :last-amount="600" :loading="isLoading" />
    <Trend color="green" title="Investments" :amount="4000" :last-amount="3000" :loading="isLoading" />
    <Trend color="red" title="Saving" :amount="4000" :last-amount="4100" :loading="isLoading" />
  </section>

  <section v-if="!isLoading">
    <h2 class="text-xl font-extrabold">Transactions</h2> 
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