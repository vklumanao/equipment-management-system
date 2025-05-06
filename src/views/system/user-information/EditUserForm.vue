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
  contact_number: '',
  address: '',
  birthday: '',
  position: '',
  gender: '',
  about: '',
})

const fullname = ref('')
const isEditing = ref(false) // Flag to toggle edit mode
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

  // Add new fields here
  userData.value.contact_number = metadata.contact_number || ''
  userData.value.address = metadata.address || ''
  userData.value.birthday = metadata.birthday || ''
  userData.value.position = metadata.position || ''
  userData.value.gender = metadata.gender || ''
  userData.value.about = metadata.about || ''

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
    showSnackbar('Upload failed!')
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
      showSnackbar('User not authenticated. Please log in again.')
      return
    }

    updateFullname()

    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        firstname: userData.value.firstname,
        lastname: userData.value.lastname,
        email: userData.value.email,
        avatar_url: userData.value.avatar_url,
        fullname: fullname.value,

        // Additional fields
        contact_number: userData.value.contact_number,
        address: userData.value.address,
        birthday: userData.value.birthday,
        position: userData.value.position,
        gender: userData.value.gender,
        about: userData.value.about,
      },
    })

    if (updateError) {
      console.error('Failed to update user metadata:', updateError.message)
      showSnackbar('Failed to save changes. Please try again.')
      return
    }

    showSnackbar('Profile updated successfully!')
    isEditing.value = false
  } catch (error) {
    console.error('Unexpected error while saving profile:', error)
    showSnackbar('An unexpected error occurred. Please try again later.')
  }
}

// Toggle edit mode
const toggleEditMode = () => {
  isEditing.value = !isEditing.value
}

// Update fullname when userData is changed
const updateFullnameOnChange = () => {
  updateFullname()
}

// ================================
// Breadcrumb Items
// ================================
const breadcrumbs = ref([
  { title: 'Dashboard', disabled: false, href: '/dashboard' },
  { title: 'User Settings', disabled: true, href: '' },
])

// Snackbar state
const snackbar = ref({
  show: false,
  message: '',
  color: 'success', // 'error', 'warning', etc.
})

// Snackbar trigger function
const showSnackbar = (message, color = 'success') => {
  snackbar.value.message = message
  snackbar.value.color = color
  snackbar.value.show = true
}

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

      <!-- Welcome Manager Card -->
      <v-card
        class="mb-6 pa-6 rounded-2xl"
        elevation="4"
        style="
          border-radius: 20px;
          background-color: #f9fafb;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
          transition: all 0.3s ease;
        "
      >
        <div class="d-flex align-center justify-space-between">
          <div>
            <h2 class="font-weight-bold mb-2">
              Welcome,
              <span
                class="px-3 py-1 bg-blue-lighten-5 text-primary rounded-pill font-weight-semibold"
              >
                {{ fullname }}
              </span>
              👋
            </h2>
            <p class="text-grey-darken-1">Manage your personal information and profile photo.</p>
          </div>
        </div>
      </v-card>

      <v-card
        class="mt-2 px-6 mx-auto text-center"
        elevation="4"
        max-width="100%"
        rounded="xl"
        color="white"
        flat
      >
        <v-card-text>
          <v-form>
            <!-- Avatar + Upload -->
            <v-avatar size="200" class="mx-auto mb-5 elevation-4" style="border: 3px solid #e0e0e0">
              <v-img :src="userData.avatar_url || 'default-avatar-url.png'" />
            </v-avatar>

            <v-file-input
              class="mb-6"
              style="max-width: 250px; margin: 0 auto"
              variant="solo"
              density="compact"
              hide-details
              accept="image/*"
              prepend-icon="mdi-camera"
              :label="isEditing ? 'Upload Photo' : ''"
              :disabled="!isEditing"
              color="primary"
              @change="handlePhotoUpload"
            />

            <v-row dense>
              <!-- Full Name (View Mode Only) -->
              <v-col cols="12" v-if="!isEditing">
                <v-text-field
                  v-model="fullname"
                  label="Full Name"
                  prepend-inner-icon="mdi-account"
                  variant="filled"
                  color="primary"
                  density="comfortable"
                  :disabled="!isEditing"
                />
              </v-col>

              <!-- First and Last Name -->
              <v-col cols="12" md="6" v-if="isEditing">
                <v-text-field
                  v-model="userData.firstname"
                  label="First Name"
                  prepend-inner-icon="mdi-account"
                  variant="filled"
                  color="primary"
                  density="comfortable"
                  @input="updateFullnameOnChange"
                />
              </v-col>
              <v-col cols="12" md="6" v-if="isEditing">
                <v-text-field
                  v-model="userData.lastname"
                  label="Last Name"
                  prepend-inner-icon="mdi-account"
                  variant="filled"
                  color="primary"
                  density="comfortable"
                  @input="updateFullnameOnChange"
                />
              </v-col>

              <!-- Email -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="userData.email"
                  label="Email"
                  prepend-inner-icon="mdi-email"
                  variant="filled"
                  color="primary"
                  density="comfortable"
                  :disabled="!isEditing"
                />
              </v-col>

              <!-- Contact Number -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="userData.contact_number"
                  label="Contact Number"
                  prepend-inner-icon="mdi-phone"
                  variant="filled"
                  color="primary"
                  density="comfortable"
                  :disabled="!isEditing"
                />
              </v-col>

              <!-- Address -->
              <v-col cols="12">
                <v-text-field
                  v-model="userData.address"
                  label="Address"
                  prepend-inner-icon="mdi-map-marker"
                  variant="filled"
                  color="primary"
                  density="comfortable"
                  :disabled="!isEditing"
                />
              </v-col>

              <!-- Birthday -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="userData.birthday"
                  label="Birthday"
                  prepend-inner-icon="mdi-calendar"
                  variant="filled"
                  color="primary"
                  density="comfortable"
                  type="date"
                  :disabled="!isEditing"
                />
              </v-col>

              <!-- Position -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="userData.position"
                  label="Position"
                  prepend-inner-icon="mdi-briefcase"
                  variant="filled"
                  color="primary"
                  density="comfortable"
                  :disabled="!isEditing"
                />
              </v-col>

              <!-- Gender -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="userData.gender"
                  :items="['Male', 'Female', 'Other']"
                  label="Gender"
                  prepend-inner-icon="mdi-gender-male-female"
                  variant="filled"
                  color="primary"
                  density="comfortable"
                  :disabled="!isEditing"
                />
              </v-col>

              <!-- About -->
              <v-col cols="12">
                <v-textarea
                  v-model="userData.about"
                  label="About Me"
                  prepend-inner-icon="mdi-account-details"
                  variant="filled"
                  color="primary"
                  density="comfortable"
                  :disabled="!isEditing"
                />
              </v-col>

              <!-- Buttons -->
              <v-col cols="12" class="d-flex justify-end">
                <v-btn
                  color="primary"
                  size="large"
                  class="mr-2 text-uppercase font-weight-bold"
                  elevation="2"
                  @click="toggleEditMode"
                >
                  <v-icon start>mdi-pencil</v-icon>
                  {{ isEditing ? 'Cancel' : 'Edit' }}
                </v-btn>

                <v-btn
                  v-if="isEditing"
                  color="success"
                  size="large"
                  class="text-uppercase font-weight-bold"
                  elevation="2"
                  @click="saveProfile"
                >
                  <v-icon start>mdi-content-save</v-icon>
                  Save Changes
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      location="top"
      timeout="3000"
      rounded="pill"
      elevation="3"
      class="text-center w-100"
    >
      <div class="d-flex justify-center w-100">
        {{ snackbar.message }}
      </div>
    </v-snackbar>
  </DashboardLayout>
</template>

<style scoped>
.v-card {
  border-radius: 12px;
}
.v-btn:hover {
  transform: scale(1.05);
}
</style>
