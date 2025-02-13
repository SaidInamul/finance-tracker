<script setup>
  const props = defineProps({
    transaction : Object,
    unit : String
  })
  const supabase = useSupabaseClient()

  const emit = defineEmits(['deleted', 'edited'])
  const { toastError, toastSuccess } = useAppToast()
  const { currency } = useCurrency(props.transaction.amount, props.unit)

  const isLoading = ref(false)
  const isOpen = ref(false)

  const deleteTransaction = async () => {
    isLoading.value = true
    try {
      await supabase.from('transactions')
        .delete()
        .eq('id', props.transaction.id)
        toastSuccess({
          title: 'Transaction deleted'
        })
      emit('deleted')
    } catch (error) {
      toastError({
        title: 'Transaction was not deleted'
      })
    } finally {
      isLoading.value = false
    }
  }

  const items = [
    [
      {
        label: 'Edit',
        icon: 'i-material-symbols-edit-outline-rounded',
        click: () => isOpen.value = true
      },
      {
        label: 'Delete',
        icon: 'i-material-symbols-delete-forever-outline-rounded',
        click: deleteTransaction
      }
    ]
  ]

  const isExpense = computed(() => props.transaction.type === 'Expense')

  const icon = computed(
    () => isExpense.value ? 'i-material-symbols-call-received-rounded'
      : 'i-material-symbols-call-made-rounded'
  )
  
  const iconColor = computed(
    () => isExpense.value ? 'text-red-500' : 'text-green-500'
  )
  
</script>

<template>
    <div class="grid grid-cols-3 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100">
      <div class="flex items-center justify-between space-x-4 col-span-2">
        <div class="flex items-center space-x-1">
          <UIcon :name="icon" :class="[iconColor]" />
          <div>{{ transaction.description }}</div>
        </div>
  
        <div>
          <UBadge color="white" v-if="transaction.category">{{ transaction.category }}</UBadge>
        </div>
      </div>
  
      <div class="flex items-center justify-end space-x-2">
        <div>{{ currency }}</div>
        <div>
          <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
            <UButton color="white" variant="ghost" trailing-icon="i-heroicons-ellipsis-horizontal" :loading="isLoading" />
            <TransactionModal v-model:visible="isOpen" :transaction="transaction" @saved="emit('edited')" />
          </UDropdown>
        </div>
      </div>
    </div>
  </template>