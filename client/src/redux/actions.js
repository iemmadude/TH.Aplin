import axios from "axios"

export function getOrders() {
    return async function (dispatch) {
        let res = await axios.get("http://localhost:3001/orden")
        return dispatch({
            type: "GET_ORDERS",
            payload: res.data
        })
    }
}

export function deleteOrder(id) {
    return async function (dispatch) {
        let res = await axios.delete("http://localhost:3001/orden/" + id)
        return dispatch({
            type: "DELETE_ORDER",
            payload: res.data
        })
    }
}

export function addOrder(payload) {
    return async function (dispatch) {
        let res = await axios.post("http://localhost:3001/orden", payload)
        return dispatch({
            type: "POST_ORDER",
            payload: res.data
        })
    }
}