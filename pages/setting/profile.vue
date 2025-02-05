<script setup>
    import { z } from 'zod'

    useHead({
        title: 'Setting | Profile'
    });

    const supabase = useSupabaseClient()
    const user = useSupabaseUser()
    const { toastSuccess, toastError } = useAppToast()
    
    const pending = ref(false)
    const fileInput = ref(null)

    const { getProfile } = useFetchProfile()
    const userProfile = await getProfile()
    const avatarUrl = ref(null)

    if (userProfile?.avatar) {
        avatarUrl.value =  supabase
            .storage.from('avatars')
            .getPublicUrl(userProfile?.avatar)
            .data
            .publicUrl
    }

    const state = ref({
        name: userProfile?.name
    })

    const nameSchema = z.string({
            invalid_type_error: "You can enter your name here"
        })
        .max(30, { message: "Name must be at most 30 characters" })
        .regex(/^[A-Za-z\s]+$/, { message: "Name must only contain alphabets and spaces" })


    const validateName = () => {
        const result = nameSchema.safeParse(state.value.name)
        return result.success ? "" : result.error.errors[0].message
    };

    const onFileChange = async () => {

        const file = fileInput.value.input.files[0]

        if (!file || file.length === 0) {

            console.error("No file selected")
            return
        }

        const reader = new FileReader()
        
        reader.onload = (e) => {
            avatarUrl.value = e.target.result
        }
        
        reader.readAsDataURL(file)
    }

    const edit = async () => {

        const file = fileInput.value.input.files[0]
        const fail = validateName()

        if (fail) {
            toastError({
                title : 'Error updating profile',
                description : fail
            })
            
            return
        } 

        try {
            pending.value = true

            // Update avatar
            if (file) {
                const fileExt = file.name.split('.').pop()
                const fileName = `${Math.random()}.${fileExt}`

                const { error : uploadError } = await supabase
                    .storage.from('avatars')
                    .upload(fileName, file)

                if (uploadError) throw uploadError

                const { error : updateErrorAvatar } = await supabase
                    .from('user_profiles')
                    .update({ avatar: fileName })
                    .eq('user_id', user.value.id)

                if (updateErrorAvatar) throw updateErrorAvatar

                fileInput.value.input.value = null

                const { error : deletePreviousError } = await supabase
                    .storage.from('avatars')
                    .remove([userProfile?.avatar])

                if (deletePreviousError) throw deletePreviousError
            }

            const { error : updateErrorName } = await supabase
                .from('user_profiles')
                .update({ name: state.value.name })
                .eq('user_id', user.value.id)

            if (updateErrorName) throw updateErrorName

            toastSuccess({
                title : 'Profile Updated',
                description : 'Reload the page to see the changes'
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

    const defaultAvatar = async () => {

        if (!userProfile?.avatar) {

            toastError({
                title: 'Currently default avatar'
            })

            fileInput.value.input.value = null
            return
        }

        try {
            pending.value = true

            const { error : updateError } = await supabase
                .from('user_profiles')
                .update({ avatar: null })
                .eq('user_id', user.value.id)

            if (updateError) throw updateError

            const { error : deletePreviousError } = await supabase
            .storage.from('avatars')
            .remove([userProfile?.avatar])

            if (deletePreviousError) throw deletePreviousError

            toastSuccess({
                title : 'Profile updated',
                description : 'Reload the page to see the changes'
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
        fileInput.value.input.value = ''
    }

</script>

<template>
    <div
        class="flex flex-col justify-start space-y-8">

        <div class="flex justify-between items-end">
            <UAvatar :src="avatarUrl" v-if="avatarUrl" size="3xl" />
            <UAvatar :alt="user.email" v-else size="3xl" />
            <UButton type="button" variant="ghost" label="Set to default" :loading="pending" :disabled="pending" @click="defaultAvatar" />
        </div>

        <UFormGroup label="Avatar:" name="avatar" help="After choosing the avatar click save to update your avatar">
            <UInput type="file" ref="fileInput" accept="image/png, image/jpeg, image/jpg" @change="onFileChange"/>
        </UFormGroup>

        <UFormGroup label="Name:" name="name" :error="validateName()">
            <UInput type="text" v-model="state.name"/>
        </UFormGroup>

        <div class="flex justify-end space-x-3">
            <UButton type="button" variant="ghost" label="Cancel" class="self-end" @click="cancelUpdate" />
            <UButton type="submit" variant="solid" label="Save" class="self-end" :loading="pending" :disabled="pending" @click="edit"/>
        </div>
        
    </div>
</template>