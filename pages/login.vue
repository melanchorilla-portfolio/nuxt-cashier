<template>
  <v-row>
    <v-col cols="8" offset="2" md="4" offset-md="4">
      <v-card class="mb-2">
        <v-toolbar color="primary" dark>Login</v-toolbar>
        <v-card-text>
          <v-form>
            <v-text-field name="email" type="email" label="Email" required />
            <v-text-field name="password" type="password" label="Password" required />
          </v-form>
        </v-card-text>
        <v-card-actions>
            <v-spacer />
            <v-btn color="primary">Login</v-btn>
        </v-card-actions>
      </v-card>
      <router-link to="/register">Register</router-link>
    </v-col>
  </v-row>
</template>
