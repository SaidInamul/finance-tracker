<script setup lang="ts">
const items = [
  [{
    label: 'Name user',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/739984?v=4'
    }
  }], [{
    label: 'Setting',
    icon: 'i-material-symbols-admin-panel-settings-outline-rounded',
  }], [{
    label: 'Sign out',
    icon: 'i-material-symbols-power-settings-new-outline-rounded',
  }]
]
</script>

<template>
    <header class="flex justify-between items-center mt-10">
        <NuxtLink to="/" class="text-2xl font-bold flex items-center gap-2">
            <img src="/monster.png" alt="monster logo" class="w-8 h-8">
            Finance Tracker
        </NuxtLink>
        <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
            <UButton color="white" label="Options" trailing-icon="i-heroicons-chevron-down-20-solid" />
        </UDropdown>
    </header>
</template>

