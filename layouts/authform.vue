<template>
    <div class="container mx-auto max-w-4xl">
        <AppHeader />
        <main class="my-10">
            <div class="flex flex-col space-y-6 mx-auto pt-10 max-w-lg">
                <img src="/monster.png" alt="monster logo" class="w-16 h-16 self-center">
                <h1 class="text-3xl text-center">{{ route.meta.title }}</h1>
                <slot />
            </div>
        </main>
    </div>
  </template>
  
  <script setup>
  import { useRoute } from 'vue-router';
  
  const route = useRoute()
  useHead({
    link: [
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com'
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter&display=swap',
        crossorigin: ''
      }
    ]
  })
  </script>
  
  <style>
  /* Set the font family for the entire site */
  body {
    font-family: 'Inter';
  }
  /* Set the background color for the entire site */
  body {
    @apply dark:bg-gray-900 bg-white
  }
  </style>