<script setup>
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
  firstname: '',
  lastname: '',
  role: '',
  avatar_url: '',
})

const fullname = ref('')
const isEditing = ref(false)  // Flag to toggle edit mode
const imageFile = ref(null)
const imageUrl = ref('')
const originalUserData = ref({})

// Function to update fullname based on firstname and lastname
const updateFullname = () => {
  fullname.value = `${userData.value.firstname} ${userData.value.lastname}`.trim()
}

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
  userData.value.firstname = metadata.firstname || ''
  userData.value.lastname = metadata.lastname || ''
  userData.value.role = metadata.role
  userData.value.avatar_url = metadata.avatar_url || ''

  updateFullname()

  originalUserData.value = { ...userData.value }
  if (userData.value.avatar_url) {
    imageUrl.value = userData.value.avatar_url
  }
}

const handlePhotoUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  imageFile.value = file
  imageUrl.value = URL.createObjectURL(file)

  const userId = userData.value.email.replace(/[@.]/g, '_')
  const filePath = `profile-photos/${userId}_${Date.now()}_${file.name}`

  const { error } = await supabase.storage.from('profile-photos').upload(filePath, file)

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
        firstname: userData.value.firstname,
        lastname: userData.value.lastname,
        email: userData.value.email,
        avatar_url: userData.value.avatar_url,
        fullname: fullname.value,  // Ensure fullname contains both firstname and lastname
      },
    })
    console.log('Before Update:', userData.value);
console.log('New Avatar URL:', userData.value.avatar_url);


    if (updateError) {
      console.error('Failed to update user metadata:', updateError.message)
      alert('Failed to save changes. Please try again.')
      return
    }

    alert('Profile updated successfully!')
    isEditing.value = false  // Disable editing after saving
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

      <div class="justify-center mb-4 text-primary font-weight-bold">
          
          <h1>User Profile</h1>
        </div>
      <!-- ===========================
             User Settings Form
             =========================== -->
      <v-card
        class="mt-4 pa-8 mx-auto text-center"
        elevation="3"
        max-width="100%"
        rounded="xl"
        color="grey-lighten-5"
      >
        

        <v-card-text>
          <v-form>
            <!-- Avatar + Upload -->
            <v-avatar size="140" class="mx-auto mb-4 elevation-2">
              <v-img :src="userData.avatar_url" />
            </v-avatar>

            <v-file-input
              class="mb-6"
              variant="underlined"
              density="compact"
              label="Change Profile Photo"
              accept="image/*"
              prepend-icon="mdi-camera"
              @change="handlePhotoUpload"
              hide-details
              :disabled="!isEditing"  
            />

            <!-- Full Name -->
            <v-text-field
              v-if="!isEditing" 
              v-model="fullname"
              label="Full Name"
              prepend-inner-icon="mdi-account"
              variant="underlined"
              density="comfortable"
              class="mb-4"
              :disabled="!isEditing"  
            />

            <!-- First Name (editable when in edit mode) -->
            <v-text-field
              v-if="isEditing" 
              v-model="userData.firstname"
              label="First Name"
              prepend-inner-icon="mdi-account"
              variant="underlined"
              density="comfortable"
              class="mb-4"
              @input="updateFullnameOnChange"
            />

            <v-text-field
              v-if="isEditing" 
              v-model="userData.lastname"
              label="Last Name"
              prepend-inner-icon="mdi-account"
              variant="underlined"
              density="comfortable"
              class="mb-4"
              @input="updateFullnameOnChange"
            />

            <!-- Email -->
            <v-text-field
              v-model="userData.email"
              label="Email"
              prepend-inner-icon="mdi-email"
              variant="underlined"
              density="comfortable"
              class="mb-6"
              :disabled="!isEditing"  
            />

            <!-- Edit Button -->
            <v-btn
              color="primary"
              size="large"
              class="text-white px-8"
              rounded="xl"
              elevation="1"
              @click="toggleEditMode"
            >
              <v-icon start>mdi-pencil</v-icon>
              {{ isEditing ? 'Cancel' : 'Edit' }}
            </v-btn>

            <!-- Save Button -->
            <v-btn
              v-if="isEditing" 
              color="primary"
              size="large"
              class="text-white px-8"
              rounded="xl"
              elevation="1"
              @click="saveProfile"
              :disabled="!isEditing" 
            >
              <v-icon start >mdi-content-save</v-icon>
              Save Changes
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </DashboardLayout>
</template>

<style scoped></style>