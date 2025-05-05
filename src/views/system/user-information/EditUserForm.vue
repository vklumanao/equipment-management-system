<script setup>
// ==================
// Imports
// ==================
import { ref, onMounted } from 'vue'
import DashboardLayout from '@/components/system/admin-management/DashboardLayout.vue'
import { supabase, getUserInformation } from '@/utils/supabase'
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

const imageFile = ref(null)
const imageUrl = ref('')
const originalUserData = ref({})
const originalAvatarUrl = ref('')

// ==================
// Functions
// ==================
const getLoggedStatus = async () => {
  const { data: user } = await supabase.auth.getUser()
  if (!user) {
    router.replace('/') // Redirect to login
  }
}

const getUser = async () => {
  const metadata = await getUserInformation()

  userData.value.email = metadata.email
  userData.value.fullname = `${metadata.firstname} ${metadata.lastname}`
  userData.value.role = metadata.role
  userData.value.avatar_url = metadata.avatar_url || ''

  originalUserData.value = { ...userData.value }
  if (userData.value.avatar_url) {
    imageUrl.value = userData.value.avatar_url
    originalAvatarUrl.value = userData.value.avatar_url
  }
}

const handlePhotoUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  imageFile.value = file
  imageUrl.value = URL.createObjectURL(file)

  const userId = userData.value.email.replace(/[@.]/g, '_') 
  const filePath = `profile-photos/${userId}_${Date.now()}_${file.name}`

  const { error } = await supabase.storage
    .from('profile-photos')
    .upload(filePath, file)

  if (error) {
    alert('Upload failed!')
    console.error(error)
    return
  }

  const { data } = supabase.storage.from('profile-photos').getPublicUrl(filePath)
  imageUrl.value = data.publicUrl
  userData.value.avatar_url = data.publicUrl
}

const saveProfile = async () => {
  try {
 
    const { data: user, error: fetchError } = await supabase.auth.getUser()

    if (fetchError || !user) {
      console.error('Failed to fetch authenticated user:', fetchError?.message)
      alert('User not authenticated. Please log in again.')
      return
    }

    
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        avatar_url: userData.value.avatar_url,
      },
    })
    console.log('Before Update:', userData.value);
console.log('New Avatar URL:', userData.value.avatar_url);


    if (updateError) {
      console.error('Failed to update user metadata:', updateError.message)
      alert('Failed to save changes. Please try again.')
      return
    }

    originalUserData.value.avatar_url = userData.value.avatar_url

    alert('Profile photo updated successfully!')
  } catch (error) {
    console.error('Unexpected error while saving profile:', error)
    alert('An unexpected error occurred. Please try again later.')
  }
}


// ================================
// Breadcrumb Items
// ================================
const breadcrumbs = ref([
  { title: 'Dashboard', disabled: false, href: '/dashboard' },
  { title: 'User Settings', disabled: true, href: '/dashboard' },
])

onMounted(() => {
  getLoggedStatus()
  getUser()
})
</script>

<template>
  <DashboardLayout>
    <v-container class="px-2">
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

            <!-- Full Name -->
            <v-text-field
              v-model="userData.fullname"
              label="Full Name"
              prepend-inner-icon="mdi-account"
              readonly
              variant="underlined"
              density="comfortable"
              class="mb-4"
            />

            <!-- Email -->
            <v-text-field
              v-model="userData.email"
              label="Email"
              prepend-inner-icon="mdi-email"
              readonly
              variant="underlined"
              density="comfortable"
              class="mb-6"
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
