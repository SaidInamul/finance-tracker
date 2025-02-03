<script setup>

    useHead({
        title: 'Setting | Account'
    })

    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    const { toastSuccess, toastError } = useAppToast()

    const pending = ref(false)

    const destroy = async () => {
        try {
            
            const { _data, status } = await $fetch.raw('/api/delete-account', {
                method: 'POST',
                body: { userId: user.value.id },
            })

            if(_data.body.error) throw _data.body.error

            toastSuccess({
                title: 'Success',
                description: _data.body.message
            })

            await supabase.auth.signOut()
            return navigateTo('/login')

        } catch (error) {
            toastError({
                title: 'Fail',
                description: error || 'Unknown error occurred'
            })
        } finally {
            pending.value = false
        }
    }


</script>

<template>
    <UFormGroup name="deleteAccount" help="Deleting your account is irreversible. This will permanently delete your account and all associated data.">
        <UButton type="button" variant="solid" color="red" label="Delete my account" :loading="pending" :disabled="pending" @click="destroy" />
    </UFormGroup>
</template>