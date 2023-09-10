<template>
    <v-row>
      <v-col cols="8" offset="2" md="4" offset-md="4">
        <v-card class="mb-2">
          <v-toolbar color="primary" dark>Register</v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field v-model="form.fullname" :rules="rules.fullname" name="fullname" type="text" label="Full name" required />
              <v-text-field v-model="form.email" :rules="rules.email" name="email" type="email" label="Email" required />
              <v-text-field v-model="form.password" :rules="rules.password" name="password" type="password" label="Password" required />
              <v-text-field v-model="form.password_confirmation" :rules="rules.password_confirmation" name="password_confirmation" type="password" label="Password confirmation" required />
            </v-form>
          </v-card-text>
          <v-card-actions>
              <v-spacer />
              <v-btn @click="onSubmit" color="primary">Login</v-btn>
          </v-card-actions>
        </v-card>
      <router-link to="/login">Login</router-link>
      </v-col>
    </v-row>
</template>

<script>
export default ({
  data() {
    return {
      form: {
        fullname: '',
        email: '',
        password: '',
        password_confirmation: ''
      },
      rules: {
        fullname: [
          v => !!v || 'Fullname field is required'
        ],
        email: [
          v => !!v || 'Email is required',
          v => /.+@.+/.test(v) || 'Email must be valid'
        ],
        password: [
          v => !!v || 'Fullname field is required',
          v => v.length >= 6 || 'Password must be at least 6 characters'
        ],
        password_confirmation: [
          v => v === this.form.password || 'Password confirmation must be same with Password'
        ]
      }
    }
  },
  methods: {
    onSubmit() {
      this.$axios.post('https://localhost:3000/auth/register', this.form)
        .then(response => {
          console.log(response)
        })
    }
  }
})
</script>
  