<template>
  <v-row>
    <v-col cols="8" offset="2">
      <v-card class="mb-2">
        <v-toolbar color="primary" dark>Create User</v-toolbar>
        <v-card-text>
          <v-breadcrumbs divider="/" :items="breadcrumbs" class="pa-0" />
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
              @keydown="checkEmailExist"
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
            <v-select
              :items="roles"
              v-model="form.role"
              label="Role"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <!-- <v-btn @click="onSubmit" color="primary" :disabled="isDisable">
            <span v-if="!isDisable"> Add </span>
            <v-progress-circular v-else color="primary" indeterminate />
          </v-btn> -->
          <v-btn @click="onSubmit" color="primary" :loading="isDisable">
             Add
          </v-btn>
        </v-card-actions>
      </v-card>
      <router-link to="/login">Login</router-link>
    </v-col>
  </v-row>
</template>

<script>
export default {
  middleware: ['authenticated'],
  head: {
    title: 'Create User',
  },
  data() {
    return {
      breadcrumbs: [
        { text: 'Users', to: '/users', disabled: false, exact: true },
        { text: 'Create', disabled: true },
      ],
      emailExist: false,
      isDisable: false,
      form: {
        fullname: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',
      },
      roles: ['admin', 'cashier', 'employee'],
      rules: {
        fullname: [
          (v) => !!v || this.$t('FIELD_REQUIRED', { field: 'Nama lengkap' }),
        ],
        role: [(v) => !!v || this.$t('FIELD_REQUIRED', { field: 'Role' })],
        email: [
          (v) => !!v || this.$t('FIELD_REQUIRED', { field: 'Email' }),
          (v) => /.+@.+/.test(v) || this.$t('EMAIL_INVALID'),
          (v) => !this.emailExist || this.$t('EMAIL_EXIST'),
        ],
        password: [
          (v) => !!v || this.$t('FIELD_REQUIRED', { field: 'Password' }),
          (v) =>
            v.length >= 6 ||
            this.$t('FIELD_MIN', { field: 'Password', min: 6 }),
        ],
        password_confirmation: [
          (v) =>
            v === this.form.password ||
            this.$t('FIELD_CONFIRM', {
              field: 'Konfirmasi password',
              confirm: 'password',
            }),
        ],
      },
    }
  },
  methods: {
    checkEmailExist() {
      this.emailExist = false
    },
    onSubmit() {
      if (this.$refs.form.validate()) {
        this.isDisable = true
        this.$axios
          .$post('/users', this.form)
          .then((response) => {
            // redirect to login page
            this.isDisable = false
            // this.$router.push('/users')
            this.$router.push({
              name: 'users___' + this.$i18n.locale,
              params: {
                message: 'CREATE_SUCCESS',
                fullname: this.form.fullname,
              },
            })
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
