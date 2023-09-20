<template>
  <v-row>
    <v-col cols="8" offset="2" md="4" offset-md="4">
      <v-card class="mb-2">
        <v-toolbar color="primary" dark>Login</v-toolbar>
        <v-card-text>
          <v-alert color="red lighten-1" dark v-if="message">{{
            $t(message)
          }}</v-alert>
          <v-form ref="form">
            <v-text-field
              v-model="form.email"
              :rules="rules.email"
              name="email"
              type="email"
              label="Email"
              required
            />
            <v-text-field
              v-model="form.password"
              :rules="rules.password"
              name="password"
              type="password"
              label="Password"
              required
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <!-- <v-btn @click="onSubmit" color="primary" :disabled="isDisable">
            <span v-if="!isDisable"> Login </span>
            <v-progress-circular v-else color="primary" indeterminate />
          </v-btn> -->
          <v-btn @click="onSubmit" color="primary" :loading="isDisable">
             Login
          </v-btn>
        </v-card-actions>
      </v-card>
      <router-link to="/register">Register</router-link>
    </v-col>
  </v-row>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  middleware: ['unauthenticated'],
  head: {
    title: 'Login'
  },
  data() {
    return {
      isDisable: false,
      message: '',
      form: {
        email: '',
        password: '',
      },
      rules: {
        email: [
          (v) => !!v || 'Email is required',
          (v) => /.+@.+/.test(v) || 'Email must be valid',
        ],
        password: [
          (v) => !!v || 'Password is required',
          (v) => v.length >= 6 || 'Password must be at least 6 characters',
        ],
      },
    }
  },
  methods: {
    ...mapMutations('auth', {
      setFullname: 'setFullname',
      setAccessToken: 'setAccessToken',
      setRefreshToken: 'setRefreshToken',
    }),
    storeWelcomeScreen() {
      localStorage.setItem('welcomeScreen', true)
    },
    onSubmit() {
      if (this.$refs.form.validate()) {
        this.isDisable = true
        this.$axios
          .$post('/auth/login', this.form)
          .then((response) => {
            this.isDisable = false
  
            if (!localStorage.welcomeScreen) {
              this.storeWelcomeScreen()
            }
  
            // store auth data 
            this.setFullname(response.user.fullname)
            this.setAccessToken(response.accessToken)
            this.setRefreshToken(response.refreshToken)
  
            this.$router.push('/dashboard')
          })
          .catch((error) => {
            this.isDisable = false
            this.message = error.response.data.message
          })
      }
    },
  },
  mounted() {
    if (this.$route.params.message == 'AUTH_REQUIRED') {
      this.message = this.$route.params.message
    }
  }
}
</script>
