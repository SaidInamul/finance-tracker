<script setup>
  import { transactionViewOptions } from '~/constants';
  import Trend from '~/components/trend.vue';

  const supabase = useSupabaseClient()
  const selectedView = ref(transactionViewOptions[0])
  const transactions = ref([])
  
  const { data, pending } = await useAsyncData('transactions', async () => {
    const { data, error } = await supabase.from('Transactions').select('*')
    
    if (error) {
      return []
    }

    // useAsyncData will return reactive data
    return data
  })

    // access the data using value
    transactions.value = data.value
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
    <Trend color="green" title="Income" :amount="2000" :last-amount="1000" :loading="false" />
    <Trend color="red" title="Expense" :amount="500" :last-amount="600" :loading="false" />
    <Trend color="green" title="Investments" :amount="4000" :last-amount="3000" :loading="false" />
    <Trend color="red" title="Saving" :amount="4000" :last-amount="4100" :loading="false" />
  </section>

  <section class="">
    <!-- <div>
      <h2 class="text-2xl font-extrabold">Transactions</h2>
      <div class="text-gray-500 dark:text-gray-400">
        You have {{ incomeCount }} incomes and {{ expenseCount }} expenses this period
      </div>
    </div>
    <div>
      <TransactionModal v-model="isOpen" @saved="refresh()" />
      <UButton icon="i-heroicons-plus-circle" color="white" variant="solid" label="Add" @click="isOpen = true" />
    </div> -->
    <TransactionTest v-for="transaction in transactions" :key="transaction.id" :transaction="transaction"/>
  </section>
</template>