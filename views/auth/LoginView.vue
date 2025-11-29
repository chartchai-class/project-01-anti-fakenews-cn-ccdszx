<script setup lang="ts">
import InputText from '@/components/InputText.vue'
import * as yup from 'yup'
import { useField, useForm } from 'vee-validate'
import { useAuthStore } from '@/stores/auth.ts'
import { useRouter, RouterLink } from 'vue-router'
import { useMessageStore } from '@/stores/message.ts'
import bamminnionsLogo from '@/assets/BamMinionsLogo.png'
import type { Ref } from 'vue'

const authStore = useAuthStore()
const messageStore = useMessageStore()
const router = useRouter()

const validationSchema = yup.object({
  email: yup.string().required('Email is required'),
  password: yup.string().required('Password is required'),
})

const { errors, handleSubmit } = useForm({
  validationSchema,
  initialValues: {
    email: '',
    password: '',
  },
})

const { value: email } = useField('email') as { value: Ref<string> }
const { value: password } = useField('password') as { value: Ref<string> }

const onSubmit = handleSubmit((values: { email: string; password: string }) => {
  authStore
    .login(values.email, values.password)
    .then(() => {
      router.push({ name: 'news-view' })
    })
    .catch(() => {
      messageStore.updateMessage('Could not log in')
      setTimeout(() => {
        messageStore.resetMessage()
      }, 3000)
    })
})
</script>

<template>
  <div>
    <div class="space-y-6">
      <!-- Header block -->
      <div class="text-center space-y-3">
        <div class="flex flex-col items-center">
          <!-- Logo badge -->
          <img :src="bamminnionsLogo" alt="Brand Logo" class="w-20 h-20 object-contain" />
          <!-- Headline -->
          <h2 class="mt-4 text-lg font-extrabold text-gray-900">Welcome Bam Minions News</h2>
          <div>
            <p class="text-sm text-gray-500">Please log in to your account</p>
          </div>
        </div>
      </div>

      <!-- Form -->
      <form class="space-y-5" @submit.prevent="onSubmit">
        <!-- Email -->
        <div class="flex flex-col gap-1">
          <label for="email" class="text-sm font-medium text-gray-900"> Email </label>
          <InputText
            type="text"
            id="email"
            v-model="email"
            placeholder="Email address"
            :error="errors['email']"
          />
        </div>

        <!-- Password -->
        <div class="flex flex-col gap-1">
          <div class="flex items-center justify-between">
            <label for="password" class="text-sm font-medium text-gray-900"> Password </label>
          </div>

          <InputText
            type="password"
            id="password"
            v-model="password"
            placeholder="Password"
            :error="errors['password']"
          />
        </div>

        <!-- Button -->
        <button
          type="submit"
          class="w-full inline-flex justify-center rounded-md bg-black px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        >
          Sign In
        </button>

        <!-- helper text -->
        <p class="text-center text-xs text-gray-500">
          New here?
          <RouterLink
            :to="{ name: 'register' }"
            class="font-semibold text-black hover:text-gray-700"
          >
            Create an account
          </RouterLink>
        </p>
      </form>
    </div>
  </div>
</template>
