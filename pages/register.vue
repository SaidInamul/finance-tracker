<script setup>
    import { z } from 'zod'

    definePageMeta({
        layout: 'authform',
        title: 'Create account here',
        description:  'Already have an account?',
        name: 'Log in',
        link: 'login'
    })

    useRedirectIfAuthenticated()

    const isLoading = ref(false)
    const form = ref()
    const { toastError } = useAppToast()
    const supabase = useSupabaseClient()

    const initialState = {
        email: undefined,
        password: undefined,
        confirmPassword: undefined
    }
    const state = reactive({
        ...initialState
    })
    const schema = z.object({
        email: z.string().email(),
        password: z.string().min(6, { message: 'Password must be more than 6 characters long' }),
        confirmPassword: z.string().min(6, { message: 'Confirm Password must be more than 6 characters long' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    })

    const resetForm = () => {
        Object.assign(state, initialState)
        form.value.clear()
    }

    const register = async () => {
        isLoading.value = true
        try {
            const { data, error } = await supabase.auth.signUp({
                email: state.email,
                password: state.password,
            }, {
                redirectTo : 'http://localhost:3000/'
            })

            if (error) {
                throw error
            }

        } catch (error) {
            toastError({
                title: 'Registration failed',
                description: error.message,
            })

        } finally {
            isLoading.value = false
            resetForm()
        }
    }
</script>

<template>
    <UForm 
        :schema="schema"
        :state="state"
        ref="form"
        class="space-y-6"
        @submit.prevent="register()"
        :validateOn="['change', 'input', 'submit']">
        
        <UFormGroup label="Email" name="email" size="xl" required>
            <UInput type="text" placeholder="Email" icon="i-material-symbols-mail-outline-rounded" v-model="state.email"/>
        </UFormGroup>
    
        <UFormGroup label="Password" name="password" size="xl" required>
            <UInput type="password" placeholder="Password" icon="i-material-symbols-password-rounded" v-model="state.password"/>
        </UFormGroup>

        <UFormGroup label="Confirm Password" name="confirmPassword" size="xl" required>
            <UInput type="password" placeholder="Confirm password" icon="i-material-symbols-password-rounded" v-model="state.confirmPassword"/>
        </UFormGroup>

        <UButton type="submit" size="xl" block>
            Submit
        </UButton>
    </UForm>
  </template>