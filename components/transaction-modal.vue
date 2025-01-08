<script setup>
    // import { z } from 'zod'
    import { categories, types } from '~/constants';
    const props = defineProps({
        modelValue : Boolean
    })
    const emit = defineEmits(['update:modelValue'])
    const state = reactive({
        amount: undefined,
        created_at: '',
        type: '',
        category: '',
        description: '',
    })

    const isOpen = computed({
        get: () => props.modelValue,
        set: (value) => emit('update:modelValue', value)
    })

    
</script>

<template>
    <UModal v-model="isOpen">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <h1 class="font-medium text-lg">Add New Transaction</h1>
            </template>
            <UForm :state="state" @submit="save" class="space-y-6">
                
                <div class="flex space-x-6">
                    <UFormGroup label="Amount" :required="true" name="amount" class="basis-1/2">
                        <UInput  type="number" placeholder="Enter amount" v-model="state.amount"/>
                    </UFormGroup>
                    <UFormGroup label="Date" name="created_at" :required="true" class="basis-1/2">
                        <UInput  type="date" icon="i-heroicons-calendar-days-20-solid" v-model="state.created_at"/>
                    </UFormGroup>
                </div>
                
                <div class="flex space-x-6">
                    <UFormGroup label="Type" :required="true" name="type" class="basis-1/2">
                        <UInputMenu
                            trailing-icon="i-heroicons-chevron-up-down-20-solid"
                            class="w-full"
                            placeholder="Select type"
                            :options="types"
                            model-value=""
                            v-model="state.type"
                        />
                    </UFormGroup>
                    <UFormGroup label="Category" name="category" class="basis-1/2">
                        <UInputMenu
                            trailing-icon="i-heroicons-chevron-up-down-20-solid"
                            class="w-full"
                            placeholder="Select a category"
                            :options="categories"
                            model-value=""
                            v-model="state.category"
                        />
                    </UFormGroup>
                </div>

                <UFormGroup label="Description" name="description">
                    <UTextarea
                        :autoresize="false"
                        placeholder="Describe your transaction here..."
                        model-value=""
                        v-model="state.description"
                    />
                </UFormGroup>

                <UButton type="submit" label="Save" block />
            </UForm>
        </UCard>
    </UModal>
</template>