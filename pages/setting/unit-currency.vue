<script setup>
    import { z } from 'zod'
    import { unit } from '~/constants';

    useHead({
        title: 'Setting | Unit Currency'
    });

    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    const currentUnit = ref(unit[0])

    const { toastSuccess, toastError } = useAppToast()
    const pending = ref(false)

    const state = ref({
        unit: currentUnit,
    })

    const schema = z.object({
        unit: z.string()
    })

    const saveUnit = async () => {
        pending.value = true

        try {

            const { error } = await supabase.auth.updateUser(data)
            if (error) throw error

            toastSuccess({
                title: 'Currency updated',
                description: 'Your currency has been updated'
            })
        } catch (error) {
            toastError({
                title: 'Error updating currency',
                description: error.message
            })
        } finally {
            pending.value = false
        }
    }

    const home = () => navigateTo('/')
</script>

<template>
    <UForm :state="state" :schema="schema" @submit.prevent="saveUnit" class="flex flex-col justify-start space-y-8">
        <UFormGroup label="Currency:" name="unit" class="w-64">
            <USelectMenu v-model="state.unit" :options="unit" />
        </UFormGroup>

        <div class="flex justify-between space-x-3">
            <UButton type="button" color="white" label="Default" @click="home()" class="self-start" />
            <div class="flex space-x-4">
                <UButton type="button" variant="ghost" label="Cancel" @click="home()" class="self-end" />
                <UButton type="submit" variant="solid" label="Save" class="self-end" :loading="pending" :disabled="pending" />
            </div>
        </div>
        
    </UForm>
</template>