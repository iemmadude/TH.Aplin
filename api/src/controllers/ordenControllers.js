import Orden from "../models/Orden.js"

export const addOrden = async (req, res) => {
    const { id, productos } = req.body
    try {
        const existingOrden = await Orden.find({ id: id })
        if (existingOrden.length > 0) {
            return res.status(400).json({ msg: `Error - La orden con el id ${id} ya existe` })
        }
        const newOrden = await Orden.create({
            id: id,
            productos: productos
        })
        return res.status(200).json(newOrden)
    } catch (e) {
        return res.status(400).json({ msg: `Error - Ha ocurrido un error desconocido`})
    }
}

export const getOrden = async (req, res) => {
    try {
        const ordenes = await Orden.find()
        if (!ordenes) {
            return res.status(400).json({ msg: `Error - No existe ninguna orden` })
        }
        return res.status(200).json(ordenes)
    } catch (e) {
        return res.status(400).json({ msg: `Error - Ha ocurrido un error desconocido` })
    }
}

export const deleteOrden = async (req, res) => {
    const { id } = req.params
    try {
        const ordenToDelete = await Orden.findOneAndDelete({ id: id })
        if (!ordenToDelete) {
            return res.status(400).json({ msg: `Error - No se ha encontrado ninguna orden con ese id` })
        }
        return res.status(200).json(ordenToDelete)
    } catch (e) {
        return res.status(400).json({ msg: `Error - Ha ocurrido un error desconocido` })
    }
}

export const updateOrden = async (req, res) => {
    const { id } = req.params
    const { productos } = req.body
    try {
        const orden = await Orden.findOne({id: id})
        console.log(orden)
        if (!orden) {
            return res.status(400).json({ msg: `Error - No se ha encontrado ninguna orden con ese id` })
        }
        productos.map(e => orden.productos.push(e))
        orden.save()
        return res.status(200).json(orden)
    } catch (e) {
        return res.status(400).json({ msg: `Error - Ha ocurrido un error desconocido` })
    }
    
}
