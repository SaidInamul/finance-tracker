<script setup>
    import { z } from 'zod'

    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    const { toastSuccess, toastError } = useAppToast()
    const pending = ref(false)

    const state = ref({
        name: user.value.user_metadata?.full_name,
    })

    const schema = z.object({
        name: z.string().min(2).optional(),
    })

    const saveProfile = async () => {
        pending.value = true

        try {

            const { error } = await supabase.auth.updateUser(data)
            if (error) throw error

            toastSuccess({
                title: 'Profile updated',
                description: 'Your profile has been updated'
            })
        } catch (error) {
            toastError({
                title: 'Error updating profile',
                description: error.message
            })
        } finally {
            pending.value = false
        }
    }
</script>

<template>
    <UForm
        :state="state"
        :schema="schema"
        @submit.prevent="saveProfile"
        class="flex flex-col justify-start space-y-8">

        <UFormGroup label="Name:" name="name">
            <UInput v-model="state.name" />
        </UFormGroup>

        <div class="flex justify-end space-x-3">
            <UButton type="button" variant="ghost" label="Clear" class="self-end" />
            <UButton type="submit" variant="solid" label="Save" class="self-end" :loading="pending" :disabled="pending" />
        </div>
        
    </UForm>
</template>