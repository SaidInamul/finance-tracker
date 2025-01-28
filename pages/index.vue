<script setup>
  import { transactionViewOptions } from '~/constants';
  import Trend from '~/components/trend.vue';

  const selectedView = ref(transactionViewOptions[0])
  const { current, previous } = useSelectedTimePeriod(selectedView)
  const isOpen = ref(false)
  const {
    byDate,
    income,
    totalIncome,
    expense,
    totalExpense,
    pending,
    refresh
  } = useFetchTransactions(current)  //pass the current date

  await refresh() // explicitly call the refresh for current date

  const {
    totalIncome : prevTotalIncome,
    totalExpense : prevTotalExpense,
    refresh : refreshPrevious
  } = useFetchTransactions(previous) //pass the previous date
  await refreshPrevious () // explicitly call the refresh for previous date

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
    <Trend color="green" title="Income" :amount="totalIncome" :last-amount="prevTotalIncome" :loading="pending" />
    <Trend color="red" title="Expense" :amount="totalExpense" :last-amount="prevTotalExpense" :loading="pending" />
    <Trend color="green" title="Investments" :amount="4000" :last-amount="3000" :loading="pending" />
    <Trend color="red" title="Saving" :amount="4000" :last-amount="4100" :loading="pending" />
  </section>

  <section class="flex justify-between">
    <div>
      <h2 class="text-2xl font-extrabold">Transactions</h2>
      <div class="text-gray-500 dark:text-gray-400">
        You have {{ income.length }} incomes and {{ expense.length }} expenses this period
      </div>
    </div>
    <div>
      <!-- <TransactionModal v-model="isOpen" @saved="refresh()" /> -->
      <UButton icon="i-heroicons-plus-circle" color="white" variant="solid" label="Add" @click="isOpen = true" />
      <TransactionModal v-model:visible="isOpen" @saved="refresh()"/>
    </div>
  </section>

  <section v-if="!pending">
    <div v-for="(transactionOnDay, date) in byDate" :key="date" class="mb-10">
      <DailyTransaction :transactions="transactionOnDay" :date="date"/>
      <TransactionTest
        v-for="transaction in transactionOnDay"
        :key="transaction.id"
        :transaction="transaction"
        @deleted="refresh()"/>
    </div>
  </section>

  <section v-else>
    <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
  </section>
</template>