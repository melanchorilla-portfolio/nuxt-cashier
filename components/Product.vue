<template>
  <v-container fluid>
    <v-row align="center">
      <v-col cols="10">
        <v-autocomplete
          label="Products"
          placeholder="Enter the keyword for search"
          :search-input.sync="search"
          :loading="isLoading"
          :items="itemsSearch"
          item-text="title"
          item-value="_id"
          v-model="selectedSearch"
          return-object
          hide-no-data
        />
      </v-col>
      <v-col cols="2">
        <v-menu>
          <template v-slot:activator="{ on: category }">
            <v-btn v-on="category" color="primary"> Category </v-btn>
          </template>
          <v-list>
            <v-list-item-group>
              <v-list-item
                v-for="(category, index) in categories"
                :key="index"
                :disabled="category._id == categoryId"
                @change="updateCategoryId(category._id)"
              >
                <v-list-item-title>{{ category.title }}</v-list-item-title>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
    <v-row align="center">
      <v-col
        v-for="(product, index) in filteredProducts"
        :key="index"
        value="category._id"
        cols="2"
      >
        <v-card :title="product.title" :ripple="true" @click="addToCart(product._id)">
          <v-card-actions>
            <v-img
              :src="require(`@/assets/images/products/${product.thumbnail}`)"
            />
          </v-card-actions>
          <v-card-text align="center" class="product-title">
            {{ product.title }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  data() {
    return {
      search: null,
      isLoading: false,
      itemsSearch: [],
      selectedSearch: null,
    }
  },
  methods: {
    ...mapActions({
        updateCategoryId: 'products/updateCategoryId',
        addToCart: 'carts/addToCart',
        fetchProducts: 'products/fetchProducts',
        fetchCategories: 'products/fetchCategories'   
    }),
    resetSearchCategory() {
      this.updateCategoryId(0)
    },
  },
  computed: {
    filteredProducts() {
      if (this.categoryId) {
        return this.products.filter((product) => product.categoryId == this.categoryId)
      } 
      // else if (this.selectedSearch) {
      //   return this.products.filter((s) => s.title == this.selectedSearch.title)
      // }
      return this.products
    },
    ...mapState('products', {
      products: 'products',
      categories: 'categories',
      categoryId: 'categoryId',
    }),
  },
  watch: {
    search() {
      this.isLoading = true
      setTimeout(() => {
        this.itemsSearch = this.products.filter((e) => {
          this.resetSearchCategory()
          return e.title
        })
        this.isLoading = false
      }, 1000)
    },
    selectedSearch(product) {
      if (product) {
        this.addToCart(product._id)
      }
    }
  },
  mounted() {
    this.fetchProducts();
    this.fetchCategories();
  }
}
</script>

<style scoped>
.product-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
