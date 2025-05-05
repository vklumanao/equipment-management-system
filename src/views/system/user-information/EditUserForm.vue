<script setup>
// ==================
// Imports
// ==================
import { ref, onMounted } from 'vue'
import DashboardLayout from '@/components/system/admin-management/DashboardLayout.vue'
import { supabase, getUserInformation, formActionDefault } from '@/utils/supabase'
import { useRouter } from 'vue-router'

// ==================
// Router Instance
// ==================
const router = useRouter()

// ==================
// Reactive Variables
// ==================
const userData = ref({
  email: '',
  fullname: '',
  role: '',
  avatar_url: '',
})
const defaultPhoto = 'https://via.placeholder.com/96x96.png?text=User'
const imageFile = ref(null)
const imagePreviewUrl = ref('')
const isLoggedin = ref(false)

// ==================
// Functions
// ==================
const getLoggedStatus = async () => {
  isLoggedin.value = await isAuthenticated()
  if (!isLoggedin.value) {
    router.replace('/') // Redirect to login
  }
}

const getUser = async () => {
  const metadata = await getUserInformation()

  userData.value.email = metadata.email
  userData.value.fullname = `${metadata.firstname} ${metadata.lastname}`
  userData.value.role = metadata.role
  userData.value.avatar_url = metadata.avatar_url || ''
  imagePreviewUrl.value = userData.value.avatar_url || defaultPhoto
}

// Handle Upload Preview and Upload to Supabase
const handlePhotoUpload = async (files) => {
  const file = files?.[0]
  if (!file) return

  imageFile.value = file

  // Show preview
  const reader = new FileReader()
  reader.onload = () => {
    imagePreviewUrl.value = reader.result
  }
  reader.readAsDataURL(file)

  // Upload to Supabase Storage
  const { data: user } = await supabase.auth.getUser()
  const userId = user?.user?.id

  if (!userId) return

  const filePath = `avatars/${userId}/${Date.now()}_${file.name}`
  const { error: uploadError } = await supabase.storage
    .from('profile-photos') // Make sure your bucket is named 'profile-photos'
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (uploadError) {
    console.error('Upload error:', uploadError.message)
    return
  }

  // Get public URL
  const { data } = supabase.storage.from('profile-photos').getPublicUrl(filePath)
  userData.value.avatar_url = data.publicUrl
}

// ================================
// Breadcrumb Items
// ================================
const breadcrumbs = ref([
  { title: 'Dashboard', disabled: false, href: '/dashboard' },
  { title: 'User Settings', disabled: true, href: '/dashboard' },
])

const saveProfile = async () => {
  const { data: user, error: userError } = await supabase.auth.getUser()

  if (userError || !user?.user) {
    console.error('Failed to get user info:', userError?.message)
    return
  }

  const { error: updateError } = await supabase.auth.updateUser({
    data: {
      avatar_url: userData.value.avatar_url,
    },
  })

  if (updateError) {
    console.error('Failed to update user metadata:', updateError.message)
    return
  }

  alert('Profile photo updated successfully!')
}

onMounted(() => {
  getLoggedStatus()
  getUser()
})
</script>

<template>
  <DashboardLayout>
    <v-container class="px-2">
      <!-- ===========================
             Breadcrumbs
             =========================== -->
      <v-breadcrumbs :items="breadcrumbs" class="mb-0">
        <template #divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>

        <template #item="{ item }">
          <v-breadcrumbs-item
            :to="!item.disabled ? item.href : undefined"
            :disabled="item.disabled"
            link
          >
            {{ item.title }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>

      <!-- ===========================
             User Settings Form
             =========================== -->
      <v-card class="mt-4 pa-6" elevation="2">
        <v-card-title class="font-weight-bold">User Information</v-card-title>
        <v-card-text>
          <v-form>
            <div class="d-flex align-center mb-4">
              <v-avatar size="96" class="me-4">
                <v-img :src="imagePreviewUrl || defaultPhoto" alt="Profile Photo" />
              </v-avatar>

              <v-file-input
                label="Upload Profile Photo"
                accept="image/*"
                prepend-icon="mdi-camera"
                @change="handlePhotoUpload"
                hide-details
              />
            </div>

            <v-text-field
              v-model="userData.fullname"
              label="Full Name"
              prepend-inner-icon="mdi-account"
              readonly
            />
            <v-text-field
              v-model="userData.email"
              label="Email"
              prepend-inner-icon="mdi-email"
              readonly
            />

            <!-- Save Button -->
            <v-btn color="primary" class="mt-4" @click="saveProfile"> Save Changes </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </DashboardLayout>
</template>

<style scoped>
.v-data-table {
  background-color: #ffffff;
}

.v-card {
  border-radius: 12px;
}

.v-toolbar-title {
  font-weight: bold;
}

.v-btn {
  transition: transform 0.2s ease;
}

.v-btn:hover {
  transform: scale(1.05);
}
</style>
