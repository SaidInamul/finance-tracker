<script setup>
    import { z } from 'zod'

    definePageMeta({
        layout: 'authform',
        title: 'Welcome back!',
        description:  'Dont have an account?',
        name: 'Register here',
        link: 'register'
    })

    useRedirectIfAuthenticated()

    const isLoading = ref(false)
    const form = ref()
    const { toastError } = useAppToast()
    const supabase = useSupabaseClient()

    const initialState = {
        email: undefined,
        password: undefined
    }
    const state = reactive({
        ...initialState
    })
    const schema = z.object({
        email: z.string().email(),
        password: z.string().min(3, { message: 'Password must be more than 3 characters long' })
    })

    const resetForm = () => {
        Object.assign(state, initialState)
        form.value.clear()
    }

    const login = async () => {
        isLoading.value = true
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: state.email,
                password: state.password,
            })

            if (error) {
                throw error
            }

            return navigateTo('/')
            
        } catch (error) {
            toastError({
                title: 'Authentication failed',
                description: error.message,
            })

        } finally {
            isLoading.value = false
            resetForm()
        }
    }

</script>

<template>
    <UForm :schema="schema"
        :state="state"
        ref="form"
        class="space-y-6"
        @submit.prevent="login()"
        :validateOn="['change', 'input', 'submit']">

        <UFormGroup label="Email" name="email" size="xl" required>
            <UInput type="text" placeholder="Enter your email" icon="i-material-symbols-mail-outline-rounded" v-model="state.email"/>
        </UFormGroup>
    
        <UFormGroup label="Password" name="password" size="xl" required>
            <UInput type="password" placeholder="Enter your password" icon="i-material-symbols-password-rounded" v-model="state.password"/>
        </UFormGroup>

        <UButton type="submit" size="xl" block :loading="isLoading">
            Submit
        </UButton>
    </UForm>
  </template>