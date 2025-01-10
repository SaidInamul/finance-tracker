<script setup>
    definePageMeta({
        layout: 'authform',
        title: 'Welcome back!'
    })

</script>

<template>
    <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">

        <UFormGroup label="Email" name="email" size="xl" required>
            <UInput type="text" placeholder="Enter your email" icon="i-material-symbols-mail-outline-rounded"/>
        </UFormGroup>
    
        <UFormGroup label="Password" name="password" size="xl" required>
            <UInput type="password" placeholder="Enter your password" icon="i-material-symbols-password-rounded"/>
        </UFormGroup>

        <UButton type="submit" size="xl" block>
            Submit
        </UButton>
    </UForm>
  </template>