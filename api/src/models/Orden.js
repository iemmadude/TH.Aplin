import mongoose from "mongoose";

const ordenSchema = new mongoose.Schema({
        id: {
            type: Number,
            required: true
        },
        productos: {
            type: Array,
            default: []
    }
})

export default mongoose.model("Orden", ordenSchema)