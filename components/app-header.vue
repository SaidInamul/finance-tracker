<script setup>
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const userProfile = ref({})
  const avatar = ref(null)

if (user.value) {

  const { getProfile } = useFetchProfile()
  userProfile.value = await getProfile()

  avatar.value = computed(() => {
    if (!userProfile.value?.avatar) return null
        return supabase
        .storage.from('avatars')
        .getPublicUrl(userProfile.value?.avatar)
        .data
        .publicUrl
    })
}

  const items = [
    [{
      slot: 'account',
      disabled: true
    }], [{
      label: 'Home',
      icon: 'i-material-symbols-home-rounded',
      click: () => navigateTo('/')
    },{
      label: 'Settings',
      icon: 'i-material-symbols-admin-panel-settings-outline-rounded',
      click: () => navigateTo('/setting/profile')
    }, {
      label: 'Sign out',
      icon: 'i-material-symbols-power-settings-new-outline-rounded',
      click: async () => {
        await supabase.auth.signOut()
        return navigateTo('/login')
      }
    }]
  ]

</script>

<template>
    <header class="flex justify-between items-center mt-10">
        <NuxtLink to="/" class="text-2xl font-bold flex items-center gap-2">
            <img src="/monster.png" alt="monster logo" class="w-8 h-8">
            Finance Tracker
        </NuxtLink>
        <UDropdown 
          :items="items"
          :ui="{ item: { disabled: 'cursor-text select-text' } }"
          :popper="{ placement: 'bottom-start' }"
          v-if="user">
          <UAvatar :src="avatar?.value" v-if="avatar?.value" />
          <UAvatar :alt="user.email" v-else/>

          <template #account="{ item }">
            <div class="text-left">
              <p>
                Signed in as
              </p>
              <p class="truncate font-medium text-gray-900 dark:text-white">
                {{ user.email }}
              </p>
            </div>
          </template>

          <template #item="{ item }">
            <span class="truncate">{{ item.label }}</span>

            <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto" />
          </template>
        </UDropdown>
    </header>
</template>

