<script setup>

const links = [{
  label: 'Unit Currency',
  icon: 'i-material-symbols-currency-exchange-rounded',
  to: '/setting/unit-currency'
},{
  label: 'Time Period',
  icon: 'i-material-symbols-calendar-clock-rounded',
  to: '/setting/time-period'
},{
  label: 'Profile',
  icon: 'i-material-symbols-account-circle',
  to: '/setting/profile'
}, {
  label: 'Account',
  icon: 'i-material-symbols-settings-account-box-rounded',
  to: '/setting/account'
}]

const { getProfile } = useFetchProfile()
const userProfile = await getProfile()


</script>

<template>
  {{ userProfile }}
  <div class="flex gap-6">
    <UVerticalNavigation :links="links" class="w-48" />
    <div class="flex-1">
      <NuxtPage />
    </div>
  </div>
</template>

