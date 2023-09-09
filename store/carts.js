export const state = () => ({
    items: [],
    additionals: [
        {
            title: 'Tax',
            mode: 'percentage',
            value: 10
        },
        {
            title: 'Service Charge',
            mode: 'fixed',
            value: 50000
        }
    ]
})

export const getters = {
    cartItems: (state, getters, rootState) => {
        return state.items.map(({_id, quantity}) => {
            let product = rootState.products.products.find(product => product._id === _id)
            return {
                _id: product._id,
                title: product.title,
                price: product.price,
                quantity
            }
        })
    },
    itemTotal: () => (price, quantity) => {
        return price * quantity
    },
    subTotal: (state, getters) => {
        return getters.cartItems.reduce((total, item) => {
            return total + getters.itemTotal(item.price, item.quantity)
        }, 0)
    },
    calculatePercentage: (state, getters) => (value) => {
        return (getters.subTotal * value) / 100
    },
    sumAdditionals: (state, getters) => {
        if (state.additionals.length) {
            return state.additionals.reduce((total, item) => {
                if (item.mode === 'percentage') {
                    return total + getters.calculatePercentage(item.value)
                }
                return total + item.value
            }, 0)
        }
    },
    total: (state, getters) =>  {
        return getters.subTotal + getters.sumAdditionals
    }
}

export const mutations = {
    addItem(state, _id) {
        state.items.push({
            _id: _id,
            quantity: 1
        })
    },
    incrementItem(state, _id) {
        state.items.find(item => item._id === _id).quantity++
    },
    decrementItem(state, _id) {
        let item = state.items.find(item => item._id === _id)
        if (item.quantity > 1) {
            item.quantity--
        }
    },
    removeItem(state, _id) {
        let index = state.items.findIndex(item => item._id === _id)
        state.items.splice(index, 1)
        // state.items = state.items.filter(item => item._id !== _id)
    }
}

export const actions = {
    addToCart({commit, state}, _id) {
        const productItem = state.items.find(item => item._id === _id)
    
        if(productItem) {
            commit('incrementItem', _id)
        } else {
            commit('addItem', _id)
        }
    },
    increment({commit}, _id) {
        commit('incrementItem', _id)
    },
    decrement({commit}, _id) {
        commit('decrementItem', _id)
    },
    remove({commit}, _id) {
        commit('removeItem', _id)
    }
}