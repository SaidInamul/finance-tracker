<script setup>
    import { z } from 'zod'
    import { categories, types } from '~/constants';

    const props = defineProps({
        visible : Boolean
    })
    const emit = defineEmits(['update:visible', 'saved'])
    const form = ref()
    const isLoading = ref(false)
    const { toastError, toastSuccess } = useAppToast()
    const supabase = useSupabaseClient()

    const initialState = {
        amount: 0,
        created_at: undefined,
        type: undefined,
        category: '',
        description: '',
    }
    // default value when component is created
    const state = reactive({
        ...initialState
    })
    // set validation
    const schema = z.object({
        created_at : z.string(),
        amount : z.number().positive('Must be more than 0'),
        description : z.string().optional(),
        type : z.string(),
        category : z.string().optional()
    })

    const resetForm = () => {
        Object.assign(state, initialState)
        form.value.clear()
    }
    const isOpen = computed({
        get: () => props.visible,
        set: (value) => {
            if (!value) {
                resetForm()
            }
            emit('update:visible', value)
        }
    })

    const submit = async () => {
        isLoading.value = true
        try {
            const { error } = await supabase.from('transactions')
            .upsert({ ...state })

            if (!error) {
                toastSuccess({
                    'title': 'Transaction added'
                })
                isOpen.value = false
                emit('saved')
                return
            }
            throw error

        } catch (e) {
            toastError({
                title: 'Transaction not added',
                description: e.message,
            })

        } finally {
            isLoading.value = false

        }
        
    }

    
</script>

<template>
    <UModal v-model="isOpen">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <h1 class="font-medium text-lg">Add New Transaction</h1>
            </template>
            <UForm 
                :state="state"
                :schema="schema"
                ref="form"
                @submit.prevent="submit()"
                class="space-y-6"
                :validateOn="['change', 'input', 'submit']"
            >
                
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

                <UButton type="submit" label="Save" block :loading="isLoading" />
            </UForm>
        </UCard>
    </UModal>
</template>