<template>
  <v-row>
    <v-col cols="8" offset="2" md="4" offset-md="4">
      <v-card class="mb-2">
        <v-toolbar color="primary" dark>Register</v-toolbar>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              v-model="form.fullname"
              :rules="rules.fullname"
              name="fullname"
              type="text"
              label="Full name"
              required
            />
            <v-text-field
              v-model="form.email"
              :rules="rules.email"
              name="email"
              type="email"
              label="Email"
              required
              @keydown="checkEmail"
            />
            <v-text-field
              v-model="form.password"
              :rules="rules.password"
              name="password"
              type="password"
              label="Password"
              required
            />
            <v-text-field
              v-model="form.password_confirmation"
              :rules="rules.password_confirmation"
              name="password_confirmation"
              type="password"
              label="Password confirmation"
              required
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <!-- <v-btn @click="onSubmit" color="primary" :disabled="isDisable">
            <span v-if="!isDisable"> Register </span>
            <v-progress-circular v-else color="primary" indeterminate />
          </v-btn> -->
          <v-btn @click="onSubmit" color="primary" :loading="isDisable">
             Register
          </v-btn>
        </v-card-actions>
      </v-card>
      <router-link to="/login">Login</router-link>
    </v-col>
  </v-row>
</template>

<script>
export default {
  middleware: ['unauthenticated'],
  head: {
    title: 'Register'
  },
  data() {
    return {
      emailExist: false,
      isDisable: false,
      form: {
        fullname: '',
        email: '',
        password: '',
        password_confirmation: '',
      },
      rules: {
        fullname: [(v) => !!v || this.$t('FIELD_REQUIRED', {field: 'Nama lengkap'})],
        email: [
          (v) => !!v || this.$t('FIELD_REQUIRED', {field: 'Email'}),
          (v) => /.+@.+/.test(v) || this.$t('EMAIL_INVALID'),
          (v) => !this.emailExist || this.$t('EMAIL_EXIST')

        ],
        password: [
          (v) => !!v || this.$t('FIELD_REQUIRED', {field: 'Password'}),
          (v) => v.length >= 6 || this.$t('FIELD_MIN', {field: 'Password', min: 6}),
        ],
        password_confirmation: [
          (v) =>
            v === this.form.password ||
            this.$t('FIELD_CONFIRM', {field: 'Konfirmasi password', confirm: 'password'}),
        ],
      },
    }
  },
  methods: {
    checkEmail() {
      this.emailExist = false
    },
    onSubmit() {
      if (this.$refs.form.validate()) {

        this.isDisable = true
        this.$axios
          .$post('/auth/register', this.form)
          .then((response) => {
            // redirect to login page
            this.isDisable = false
            this.$router.push('/login')
          })
          .catch((error) => {
            if (error.response.data.message == 'EMAIL_EXIST') {
                  this.emailExist = true
                  this.$refs.form.validate()
            }
            this.isDisable = false
          })
      }
    },
  },
}
</script>
