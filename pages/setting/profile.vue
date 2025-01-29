<script setup>
    import { z } from 'zod'

    useHead({
        title: 'Setting | Profile'
    });

    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    const { toastSuccess, toastError } = useAppToast()
    
    const pending = ref(false)
    const defaultAvatar = ref(false)
    const fileInput = ref('')

    const { getProfile } = useFetchProfile()
    const userProfile = await getProfile()

    const avatarUrl = computed(() => {
        if (!userProfile?.avatar) return null
            return supabase
            .storage.from('avatars')
            .getPublicUrl(userProfile?.avatar)
            .data
            .publicUrl
        })

    const saveAvatar = async () => {

        const file = fileInput.value.input.files[0]

        if (!file) {
            toastError({
                title : 'No file uploaded',
                description : 'The avatar is not changed'
            })
            
            return
        }

        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`

        try {
            pending.value = true

            const { error : uploadError } = await supabase
                .storage.from('avatars')
                .upload(fileName, file)

            if (uploadError) throw uploadError

            const { error : updateError } = await supabase
                .from('user_profiles')
                .update({ avatar: fileName })
                .eq('user_id', user.value.id)

            if (updateError) throw updateError

            fileInput.value.input.value = null

            const { error : deletePreviousError } = await supabase
            .storage.from('avatars')
            .remove([userProfile?.avatar])

            if (deletePreviousError) throw deletePreviousError

            toastSuccess({
                title : 'Avatar Saved',
                description : 'Your profile has been updated'
            })
        } catch {
            toastError({
                title: 'Error updating profile',
                description: error.message
            })
        } finally {
            pending.value = false
        }
    }

    const cancelUpdate = () => {
        defaultAvatar.value = false
        fileInput.value.input.value = ''
    }

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
    <div
        class="flex flex-col justify-start space-y-8">

        <div class="flex justify-between items-end">
            <UAvatar :src="avatarUrl" v-if="avatarUrl && defaultAvatar === false" size="3xl" />
            <UAvatar :alt="user.email" v-else size="3xl" />
            <UButton type="button" variant="ghost" label="Set to default" @click="defaultAvatar = true" />
        </div>

        <UFormGroup label="Avatar:" name="avatar" help="After choosing the avatar click save to update your avatar">
            <UInput type="file" ref="fileInput" accept="image/png, image/jpeg, image/jpg"/>
        </UFormGroup>

        <div class="flex justify-end space-x-3">
            <UButton type="button" variant="ghost" label="Cancel" class="self-end" @click="cancelUpdate" />
            <UButton type="submit" variant="solid" label="Save" class="self-end" :loading="pending" :disabled="pending" @click="saveAvatar"/>
        </div>
        
    </div>
</template>