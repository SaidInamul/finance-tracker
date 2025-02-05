<script setup>
    import { z } from 'zod'
    import { transactionViewOptions } from '~/constants';

    useHead({
        title: 'Setting | Time Period'
    });

    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    const { getProfile } = useFetchProfile()
    const userProfile = await getProfile()

    const timePeriod = ref(userProfile.time_period)

    const { toastSuccess, toastError } = useAppToast()
    const pending = ref(false)

    const savePeriod = async () => {

        if (userProfile.time_period === timePeriod.value) {
            toastError({
                title: 'Fail updating period',
                description: 'Please select different period'
            })

            return
        }

        try {

            pending.value = true

            const { error } = await supabase
                .from('user_profiles')
                .update({time_period : timePeriod.value})
                .eq('user_id', user.value.id)
            
            if(error) throw error

            toastSuccess({
                title : 'Unit updated',
                description : 'Reload the page to see the changes'
            })

        } catch (error) {
            toastError({
                title: 'Error updating period',
                description: error.message
            })
        } finally {
            pending.value = false
        }
    }

    const defaultPeriod = async () => {

        if (userProfile.time_period === 'Yearly') {
            toastError({
                title: 'Fail updating period',
                description: 'Your current time period is Yearly'
            })

            return
        }

        try {

            pending.value = true

            const { error } = await supabase
                .from('user_profiles')
                .update({time_period : 'Yearly'})
                .eq('user_id', user.value.id)
            
            if(error) throw error

            toastSuccess({
                title : 'Period updated',
                description : 'Reload the page to see the changes'
            })

        } catch (error) {
            toastError({
                title: 'Error updating period',
                description: error.message
            })
        } finally {
            pending.value = false
        }
    }

    const cancel = () => timePeriod.value = userProfile.time_period

</script>

<template>
    <div
        class="flex flex-col justify-start space-y-8"
        >
        <UFormGroup
        label="Period:"
        name="period"
        help="By default, the time period is yearly. You may change it and click save to update your preference.">
            <USelectMenu
                v-model="timePeriod"
                :options="transactionViewOptions"
                class="w-64" />
        </UFormGroup>

        <div class="flex justify-between space-x-3">
            <UButton type="button" color="white" label="Set to default" @click="defaultPeriod" class="self-start" />
            <div class="flex space-x-4">
                <UButton type="button" variant="ghost" label="Cancel" @click="cancel" class="self-end" />
                <UButton type="submit" variant="solid" label="Save" class="self-end" @click="savePeriod" :loading="pending" :disabled="pending" />
            </div>
        </div>
        
    </div>
</template>