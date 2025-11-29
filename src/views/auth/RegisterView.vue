<script setup lang="ts">
import InputText from '@/components/InputText.vue'
import ImageUpload from '@/components/ImageUpload.vue'
import * as yup from 'yup'
import { useField, useForm } from 'vee-validate'
import { useAuthStore } from '@/stores/auth.ts'
import { useRouter } from 'vue-router'
import { useMessageStore } from '@/stores/message.ts'
import bamminnionsLogo from '@/assets/BamMinionsLogo.png'
import type { Ref } from 'vue'

const authStore = useAuthStore()
const messageStore = useMessageStore()
const router = useRouter()

const validationSchema = yup.object({
  firstname: yup.string().required('First name is required'),
  lastname: yup.string().required('Last name is required'),
  email: yup.string().required('Email is required'),
  password: yup.string().required('Password is required'),
  image: yup.array(yup.string()).max(1),
})

const { errors, handleSubmit } = useForm({
  validationSchema,
  initialValues: {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    image: [],
  },
})

const { value: firstname } = useField('firstname') as { value: Ref<string> }
const { value: lastname } = useField('lastname') as { value: Ref<string> }
const { value: email } = useField('email') as { value: Ref<string> }
const { value: password } = useField('password') as { value: Ref<string> }
const { value: image } = useField('image') as { value: Ref<string[]> }

const onSubmit = handleSubmit(
  (values: {
    firstname: string
    lastname: string
    email: string
    password: string
    image: string[]
  }) => {
    authStore
      .register(values.firstname, values.lastname, values.email, values.password, values.image)
      .then(() => {
        router.push({ name: 'news-view' })
      })
      .catch(() => {
        messageStore.updateMessage('Could not register')
        setTimeout(() => {
          messageStore.resetMessage()
        }, 3000)
      })
  },
)
</script>

<template>
  <div class=""></div>
  <div class="text-center space-y-3">
    <div class="flex flex-col items-center">
      <!-- Logo badge -->
      <img :src="bamminnionsLogo" alt="Brand Logo" class="w-20 h-20 object-contain" />
      <!-- Headline -->
      <h2 class="mt-4 text-lg font-extrabold text-gray-900">Welcome Bam Minions News</h2>
      <div>
        <p class="text-sm text-gray-500">Please sign up to your account</p>
      </div>
    </div>
  </div>

  <form class="space-y-5 py-5" @submit.prevent="onSubmit">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- First Name -->
      <div class="flex flex-col gap-1">
        <label for="firstname" class="text-sm font-medium text-gray-900"> First Name </label>
        <InputText
          type="text"
          id="firstname"
          v-model="firstname"
          placeholder="First name"
          :error="errors['firstname']"
        />
      </div>

      <!-- Last Name -->
      <div class="flex flex-col gap-1">
        <label for="lastname" class="text-sm font-medium text-gray-900"> Last Name </label>
        <InputText
          type="text"
          id="lastname"
          v-model="lastname"
          placeholder="Last name"
          :error="errors['lastname']"
        />
      </div>
    </div>

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

    <!-- Avatar / Image -->
    <div class="flex flex-col gap-1">
      <label class="text-sm font-medium text-gray-900"> Profile Image (optional) </label>
      <ImageUpload v-model="image" />
      <p v-if="errors.image" class="text-xs text-red-600">
        {{ errors.image }}
      </p>
    </div>

    <!-- Button -->
    <button
      type="submit"
      class="w-full inline-flex justify-center rounded-md bg-black px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
    >
      Create Account
    </button>

    <!-- helper text -->
    <p class="text-center text-xs text-gray-500">
      Already a member?
      <RouterLink :to="{ name: 'login' }" class="font-semibold text-black hover:text-gray-700">
        Sign in
      </RouterLink>
    </p>
  </form>
</template>
