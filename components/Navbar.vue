<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiAccountPlus, mdiLogin, mdiAccount, mdiLogout, mdiMenu, mdiClose } from '@mdi/js'
import { useAuthStore } from '@/stores/auth.ts'

const authStore = useAuthStore()
const router = useRouter()
const open = ref(false)

const isAuthed = computed(() => Boolean(authStore.currentUserName))
const userInitials = computed(() => (authStore.currentUserName?.trim()?.[0] || 'U').toUpperCase())

function logout() {
  authStore.logout()
  router.push({ name: 'login' })
  open.value = false
}
</script>

<template>
  <nav
    role="navigation"
    aria-label="Primary"
    class="fixed inset-x-0 top-0 z-50 border-b border-gray-700/40 bg-black text-white backdrop-blur"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- top bar -->

      <div class="relative flex h-20 items-center">
        <router-link
          :to="{ name: 'news-view' }"
          class="flex items-center gap-3 text-xl font-semibold tracking-tight"
          @click="open = false"
        >
          Social Anti-Fake News System
        </router-link>

        <!-- Centered title (large screens) -->
        <router-link
          :to="{ name: 'news-view' }"
          class="hidden md:flex absolute left-1/2 -translate-x-1/2 text-xl font-semibold tracking-tight"
          @click="open = false"
        >
          Social Anti-Fake News System
        </router-link>

        <!-- Right side: desktop actions + mobile toggle -->
        <div class="ml-auto flex items-center gap-2">
          <!-- Desktop menu -->
          <div class="hidden md:flex items-center gap-2">
            <!-- When logged OUT -->
            <template v-if="!isAuthed">
              <router-link
                :to="{ name: 'register' }"
                class="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-white/10 transition"
              >
                <SvgIcon type="mdi" :path="mdiAccountPlus" class="h-5 w-5" />
                <span>Sign Up</span>
              </router-link>
              <router-link
                :to="{ name: 'login' }"
                class="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-white/10 transition"
              >
                <SvgIcon type="mdi" :path="mdiLogin" class="h-5 w-5" />
                <span>Login</span>
              </router-link>
            </template>

            <!-- When logged IN -->
            <template v-else>
              <!-- Admin button (separate) -->
              <router-link
                :to="{ name: 'admin-user' }"
                :aria-current="$route.name === 'admin-user' ? 'page' : undefined"
                :class="[
                  'inline-flex items-center justify-center rounded-lg p-2 transition',
                  'hover:bg-white/10 active:bg-white/20 active:scale-95',
                  $route.name === 'admin-user' ? 'bg-white/15 ring-1 ring-white/25' : '',
                ]"
                aria-label="Admin Users"
                title="Admin Users"
              >
                <SvgIcon
                  type="mdi"
                  :path="mdiAccount"
                  :class="[
                    'h-5 w-5',
                    $route.name === 'admin-user' ? 'text-yellow-400' : 'text-yellow-500',
                  ]"
                />
              </router-link>

              <div class="inline-flex items-center gap-3 rounded-lg px-3 py-2 text-sm">
                <img
                  v-if="authStore.user?.image"
                  :src="authStore.user.image[0]"
                  alt="User Avatar"
                  class="h-8 w-8 rounded-full ring-1 ring-white/20 object-cover"
                />
                <div
                  v-else
                  class="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-xs font-semibold ring-1 ring-white/20"
                >
                  {{ userInitials }}
                </div>
                <span class="truncate max-w-[160px]"
                  >{{ authStore.currentUserName }} {{ authStore.currentUserLastname }}</span
                >
              </div>

              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-white/10 transition"
                @click="logout"
              >
                <SvgIcon type="mdi" :path="mdiLogout" class="h-5 w-5" />
                <span>Logout</span>
              </button>
            </template>
          </div>

          <!-- Mobile toggle -->
          <button
            type="button"
            class="md:hidden inline-flex items-center justify-center rounded-lg p-2 hover:bg-white/10 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            :aria-expanded="open ? 'true' : 'false'"
            aria-controls="mobile-menu"
            @click="open = !open"
          >
            <span class="sr-only">Toggle menu</span>
            <SvgIcon v-if="!open" type="mdi" :path="mdiMenu" class="h-6 w-6" />
            <SvgIcon v-else type="mdi" :path="mdiClose" class="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile panel -->
    <div
      id="mobile-menu"
      class="md:hidden border-t border-gray-700/40"
      :class="open ? 'block' : 'hidden'"
    >
      <div class="space-y-1 px-4 pb-4 pt-3">
        <template v-if="!isAuthed">
          <router-link
            :to="{ name: 'register' }"
            class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-white/10 transition"
            @click="open = false"
          >
            <SvgIcon type="mdi" :path="mdiAccountPlus" class="h-5 w-5" />
            <span>Sign Up</span>
          </router-link>

          <router-link
            :to="{ name: 'login' }"
            class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-white/10 transition"
            @click="open = false"
          >
            <SvgIcon type="mdi" :path="mdiLogin" class="h-5 w-5" />
            <span>Login</span>
          </router-link>
        </template>

        <template v-else>
          <router-link
            :to="{ name: 'admin-user' }"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-white/10 transition"
            @click="open = false"
          >
            <SvgIcon type="mdi" :path="mdiAccount" class="h-5 w-5" />
            <span class="truncate"
              >{{ authStore.currentUserName }} {{ authStore.currentUserLastname }}</span
            >

            <img
              v-if="authStore.user?.image"
              :src="authStore.user.image[0]"
              alt="User Avatar"
              class="ml-auto h-8 w-8 rounded-full ring-1 ring-white/20 object-cover"
            />
            <!-- Fallback: show mdiAccountPlus when no profile image -->
            <div
              v-else
              class="ml-auto grid h-8 w-8 place-items-center rounded-full bg-white/10 ring-1 ring-white/20"
            >
              <SvgIcon type="mdi" :path="mdiAccountPlus" class="h-5 w-5" />
              <span class="sr-only">Default avatar</span>
            </div>
          </router-link>

          <button
            type="button"
            class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-white/10 transition"
            @click="logout"
          >
            <SvgIcon type="mdi" :path="mdiLogout" class="h-5 w-5" />
            <span>Logout</span>
          </button>
        </template>
      </div>
    </div>
  </nav>
</template>
