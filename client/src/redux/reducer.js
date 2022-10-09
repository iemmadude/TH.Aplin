const initialState = {
    orders: []
}

const GET_ORDERS = "GET_ORDERS"
const POST_ORDER = "POST_ORDER"
const DELETE_ORDER = "DELETE_ORDER"

const rootReducer = (state = initialState, action) => {
    switch(action.type) {

        case GET_ORDERS:
            return {
                ...state,
                orders: action.payload
            }

        case POST_ORDER:
            return {
                ...state,
                orders: [...state.orders, action.payload]
            }

        case DELETE_ORDER:
            return {
                ...state,
                orders: state.orders.filter(e => e !== action.payload)
            }

        default:
            return state
    }
}


export default rootReducer;