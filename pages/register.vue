<script setup>
    definePageMeta({
        layout: 'authform',
        title: 'Create account here'
    })

</script>

<template>
    <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">

        <UFormGroup label="Username" name="username" size="xl" required>
            <UInput type="text" placeholder="Username" icon="i-material-symbols-person-outline-rounded"/>
        </UFormGroup>
        
        <UFormGroup label="Email" name="email" size="xl" required>
            <UInput type="text" placeholder="Email" icon="i-material-symbols-mail-outline-rounded"/>
        </UFormGroup>
    
        <UFormGroup label="Password" name="password" size="xl" required>
            <UInput type="password" placeholder="Password" icon="i-material-symbols-password-rounded"/>
        </UFormGroup>

        <UFormGroup label="Confirm Password" name="password" size="xl" required>
            <UInput type="password" placeholder="Confirm password" icon="i-material-symbols-password-rounded"/>
        </UFormGroup>

        <UButton type="submit" size="xl" block>
            Submit
        </UButton>
    </UForm>
  </template>