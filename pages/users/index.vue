<template>
  <v-row class="frame-content">
    <v-col cols="10" offset="1">
      <v-card class="my-3">
        <v-toolbar color="primary" dark>
          Users
          <v-spacer />
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          />
        </v-toolbar>
        <v-card-text>
          <v-alert v-if="alert.show" :type="alert.type">
            {{ alert.message }}
          </v-alert>
          <div class="mb-4 d-flex">
            <v-breadcrumbs :items="breadcrumbs" class="pa-0" divider="/" />
            <v-spacer></v-spacer>
            <v-btn to="/users/create" color="primary" elevation="3" small
              >Tambah user <v-icon right>mdi-plus-circle</v-icon></v-btn
            >
          </div>

          <v-data-table
            :headers="headers"
            :items="users"
            :item-per-page="10"
            :server-items-length="totalData"
            :options.sync="options"
            :search.sync="search"
            :loading="loading"
            :footer-props="{
              itemsPerPageOptions: [10, 20, 30, 40, 50],
            }"
          >
            <template v-slot:top>
              <v-dialog v-model="dialogDelete" max-width="512px">
                <v-card>
                  <v-card-title primary-title>
                    Yakin mau hapus data {{ itemDelete.fullname }}?
                  </v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="closeDelete"
                      >Cancel</v-btn
                    >
                    <v-btn
                      color="primary"
                      text
                      @click="deleteConfirm(itemDelete._id)"
                      >Delete</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn
                color="primary"
                :to="`/users/edit/${item._id}`"
                class="mr-2"
                icon
              >
                <v-icon small>mdi-pencil</v-icon>
              </v-btn>
              <v-btn color="error" icon @click="deleteItem(item)"
                ><v-icon small>mdi-delete</v-icon></v-btn
              >
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  head: {
    title: 'User'
  },
  data() {
    return {
      alert: {
        show: false,
        type: '',
        message: '',
      },
      dialogDelete: false,
      itemDelete: false,
      users: [],
      search: '',
      headers: [
        { text: '#', value: 'row', sortable: false },
        { text: 'Fullname', value: 'fullname', sortable: false },
        { text: 'Email', value: 'email', sortable: false },
        { text: 'Role', value: 'role', sortable: false },
        { text: 'Action', value: 'actions', sortable: false },
      ],
      totalData: 0,
      options: {},
      loading: false,
      breadcrumbs: [
        {
          text: 'App',
          disabled: false,
          to: '/',
        },
        {
          text: 'Users',
          disabled: true,
          to: '/users',
        },
      ],
    }
  },
  methods: {
    fetchUsers() {
      this.loading = true
      const { page, itemsPerPage } = this.options
      this.$axios
        .$get(
          `/users?page=${page}&limit=${itemsPerPage}&search=${this.search}`
        )
        .then((response) => {
          this.loading = false
          this.users = response.users.docs
          this.totalData = response.users.totalDocs

          // let startItem = (page - 1) * itemsPerPage + 1
          let startItem = response.users.pagingCounter
          this.users.map((user) => (user.row = startItem++))
        })
        .catch((err) => {
          this.loading = false
          console.log(err)
        })
    },
    deleteConfirm(id) {
      this.$axios
        .$delete(`/users/${id}`)
        .then((response) => {
          // this.users = this.users.filter(user => user._id != id)
          this.fetchUsers()
          this.closeDelete()

          let params ={
            message: 'DELETE_SUCCESS',
            fullname: this.itemDelete.fullname
          }

          this.showAlert(params)
        })
        .catch((err) => {
          console.log(err)
          this.closeDelete()
        })
    },
    deleteItem(item) {
      this.dialogDelete = true
      this.itemDelete = item
    },
    closeDelete() {
      this.dialogDelete = false
    },
    showAlert(params) {
      if (params.message == 'UPDATE_SUCCESS') {
        this.alert.show = true
        this.alert.type = 'success'
        this.alert.message = this.$t(params.message, {
          title: params.fullname,
        })
      } else if (params.message == 'CREATE_SUCCESS') {
        this.alert.show = true
        this.alert.type = 'success'
        this.alert.message = this.$t(params.message, {
          title: params.fullname,
        })
      } else if (params.message == 'DELETE_SUCCESS') {
        this.alert.show = true
        this.alert.type = 'success'
        this.alert.message = this.$t(params.message, {
          title: params.fullname,
        })
      } else if (params.message == 'ID_NOT_FOUND') {
        this.alert.show = true
        this.alert.type = 'error'
        this.alert.message = this.$t(params.message)
      }
    },
  },
  watch: {
    options: {
      handler() {
        this.fetchUsers()
      },
      deep: true,
    },
    search: {
      handler() {
        this.fetchUsers()
      },
    },
  },
  mounted() {
    this.showAlert(this.$route.params)
  },
}
</script>
