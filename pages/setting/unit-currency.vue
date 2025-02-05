<script setup>
    import { z } from 'zod'
    import { unit } from '~/constants';

    useHead({
        title: 'Setting | Unit Currency'
    });

    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    const { getProfile } = useFetchProfile()
    const userProfile = await getProfile()

    const currentUnit = ref(userProfile.unit_currency)

    const { toastSuccess, toastError } = useAppToast()
    const pending = ref(false)

    const saveUnit = async () => {

        if (userProfile.unit_currency === currentUnit.value) {
            toastError({
                title: 'Fail updating unit',
                description: 'Please select different unit'
            })

            return
        }

        try {

            pending.value = true

            const { error } = await supabase
                .from('user_profiles')
                .update({unit_currency : currentUnit.value})
                .eq('user_id', user.value.id)
            
            if(error) throw error

            toastSuccess({
                title : 'Unit updated',
                description : 'Reload the page to see the changes'
            })

        } catch (error) {
            toastError({
                title: 'Error updating unit',
                description: error.message
            })
        } finally {
            pending.value = false
        }
    }

    const cancel = () => currentUnit.value = userProfile.unit_currency

    const defaultUnit = async () => {

        if (userProfile.unit_currency === 'MYR') {
            toastError({
                title: 'Fail updating unit',
                description: 'Your current unit is Malaysia Ringgit (MYR)'
            })

            return
        }

        try {

            pending.value = true

            const { error } = await supabase
                .from('user_profiles')
                .update({unit_currency : 'MYR'})
                .eq('user_id', user.value.id)
            
            if(error) throw error

            toastSuccess({
                title : 'Unit updated',
                description : 'Reload the page to see the changes'
            })

        } catch (error) {
            toastError({
                title: 'Error updating unit',
                description: error.message
            })
        } finally {
            pending.value = false
        }
    }
</script>

<template>
    <div
        class="flex flex-col justify-start space-y-8" 
        >
        <UFormGroup label="Currency:" name="unit" help="By default, the unit is Malaysia Ringgit (MYR). You may change it and click save to update your preference.">
            <USelectMenu
                v-model="currentUnit"
                :options="unit"
                option-attribute="label"  
                value-attribute="key"
                class="w-64"
            />
        </UFormGroup>

        <div class="flex justify-between space-x-3">
            <UButton type="button" color="white" label="Set to default" :loading="pending" :disabled="pending" @click="defaultUnit" class="self-start" />
            <div class="flex space-x-4">
                <UButton type="button" variant="ghost" label="Cancel" @click="cancel" class="self-end" />
                <UButton type="submit" variant="solid" label="Save" class="self-end" :loading="pending" :disabled="pending" @click="saveUnit" />
            </div>
        </div>
        
    </div>
</template>