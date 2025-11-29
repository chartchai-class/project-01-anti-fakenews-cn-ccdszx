<script setup lang="ts">
import type { AdminUser, Role } from '@/types'
import UserService from '@/services/UserService'
import { useUsersBus } from '@/stores/users'
import { ref, watch, computed } from 'vue'

const props = defineProps<{ user: AdminUser }>()
const bus = useUsersBus()

const localEnabled = ref(false)
const localRoles = ref<Role[]>([])
const saving = ref(false)
const err = ref<string | null>(null)

watch(
  () => props.user,
  (u) => {
    localEnabled.value = !!u?.enabled
    localRoles.value = Array.isArray(u?.roles) ? (u!.roles as Role[]) : []
  },
  { immediate: true },
)

const isAdmin = computed(
  () => Array.isArray(props.user?.roles) && (props.user!.roles as Role[]).includes('ROLE_ADMIN'),
)

const currentRole = computed<Role | null>(() =>
  localRoles.value?.length ? (localRoles.value[0] as Role) : null,
)

/** Simple Tailwind role/status badge (no "Saved" state) */
const roleBadge = computed(() => {
  if (saving.value) {
    return {
      text: 'Saving…',
      ring: 'ring-blue-200',
      tone: 'text-blue-700',
      icon: 'spinner' as const,
    }
  }
  if (err.value) {
    return {
      text: 'Failed',
      ring: 'ring-red-200',
      tone: 'ext-red-700',
      icon: 'alert' as const,
    }
  }
  if (currentRole.value === 'ROLE_MEMBER') {
    return {
      text: 'Member',
      ring: 'ring-purple-200',
      tone: 'ext-purple-700',
    }
  }
  if (currentRole.value === 'ROLE_READER') {
    return {
      text: 'Reader',
      ring: 'ring-amber-200',
      tone: 'text-amber-700',
    }
  }
  return {
    text: 'No role',
    ring: 'ring-gray-200',
    tone: 'text-gray-700',
  }
})

function sendUpdate(rollback?: () => void) {
  if (saving.value) return
  saving.value = true
  err.value = null
  UserService.updateRoles(props.user.id, localRoles.value, localEnabled.value)
    .then(() => {
      // success: no toast or "Saved" state — the pill reverts to role label
      bus.reload()
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .catch((e: any) => {
      err.value = e?.response?.data?.message || e?.message || 'Update failed'
      rollback?.()
    })
    .finally(() => (saving.value = false))
}

function setRoleImmediate(role: Role) {
  if (saving.value || currentRole.value === role) return
  const prev = [...localRoles.value]
  localRoles.value = [role] // instant UI flip
  sendUpdate(() => {
    localRoles.value = prev
  }) // rollback on error
}
</script>

<template>
  <section class="max-w-2xl w-full my-6">
    <div v-if="!user" class="p-4 rounded-xl bg-white">Loading…</div>

    <article v-else class="rounded-xl bg-white overflow-hidden">
      <!-- Header with right-aligned status -->
      <header class="p-4 sm:p-5 flex items-center gap-3">
        <div
          class="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600 select-none"
        >
          {{ (user.firstname?.[0] || '').toUpperCase()
          }}{{ (user.lastname?.[0] || '').toUpperCase() }}
        </div>
        <div class="min-w-0">
          <h3 class="text-sm font-semibold text-gray-900 truncate">
            {{ user.firstname }} {{ user.lastname }}
          </h3>
          <p class="text-xs text-gray-500 truncate">@{{ user.username }}</p>
        </div>

        <!-- Simple Tailwind role/status pill -->
        <div class="ml-auto">
          <span
            class="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold"
            :class="[roleBadge.tone, roleBadge.ring]"
            aria-live="polite"
          >
            <!-- icons -->
            {{ roleBadge.text }}
          </span>
        </div>
      </header>

      <!-- Inline error -->
      <div v-if="err" class="px-4 sm:px-5 py-2" role="alert" aria-live="polite">
        <div class="text-xs text-red-700 bg-red-50 border border-red-200 rounded px-2 py-1">
          {{ err }}
        </div>
      </div>

      <!-- Body -->
      <div class="p-4 sm:p-5 space-y-4">
        <div
          v-if="isAdmin"
          class="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded px-2 py-1 text-center"
        >
          Cannot manage Admin
        </div>

        <div v-else class="space-y-3">
          <!-- Role row -->
          <div class="grid grid-cols-1 sm:grid-cols-3 items-center gap-2">
            <label class="text-sm text-gray-700">Role</label>
            <div class="sm:col-span-2 flex justify-end gap-2">
              <button
                type="button"
                class="text-sm px-2 py-1 rounded border disabled:opacity-60"
                :class="
                  currentRole === 'ROLE_MEMBER'
                    ? 'bg-purple-800 text-white border-purple-200'
                    : 'bg-white text-gray-900 hover:bg-gray-50 border-gray-300'
                "
                @click="setRoleImmediate('ROLE_MEMBER')"
                :disabled="saving || currentRole === 'ROLE_MEMBER'"
              >
                Member
              </button>

              <button
                type="button"
                class="text-sm px-2 py-1 rounded border disabled:opacity-60"
                :class="
                  currentRole === 'ROLE_READER'
                    ? 'bg-yellow-800 text-white border-yellow-800'
                    : 'bg-white text-gray-900 hover:bg-gray-50 border-gray-300'
                "
                @click="setRoleImmediate('ROLE_READER')"
                :disabled="saving || currentRole === 'ROLE_READER'"
              >
                Reader
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  </section>
</template>
