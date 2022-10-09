import React from 'react'
import axios from "axios"
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getOrders, deleteOrder, addOrder } from '../../redux/actions'
import Style from "./OrdersList.module.css"
import Swal from "sweetalert2"


export default function OrdersList() {

    //Estados
    const dispatch = useDispatch()
    const orders = useSelector((state) => state.orders)
    const [showProducts, setShowProducts] = useState(false)
    const [productsShowing, setProductsShowing] = useState("")
    const [showForm, setShowForm] = useState(false)
    const [orderForm, setOrderForm] = useState(1)
    const [manyOrderForms, setManyOrderForms] = useState([null])
    const [orderModalShows, setOrderModalShows] = useState(false)
    const [showManyForms, setShowManyForms] = useState(1)
    const [manyUpdatesForm, setManyUpdatesForm] = useState([null])
    const [idRetainer, setIdRetainer] = useState([])
    const [formId, setformId] = useState("")

    useEffect(() => {
        dispatch(getOrders())
    }, [])
    
    //CRUD
    const postNewOrder = () => {
        const orderId = Number(document.getElementsByName("orderIdInput")[0].value)
        const seeInput = manyOrderForms.map((e, i) => {
            return {
                sku: document.getElementById(i + "sku").value,
                cantidad: Number(document.getElementById(i + "cantidad").value)
            }
        })
        if (orders.map(e => e.id).includes(orderId)) {
            Swal.fire({
                title: 'Oh no!',
                text: "Parece que ya existe una orden con la ID que intentaste agregar o que el campo esta vacío",
                icon: 'error',
                confirmButtonColor: 'red',
                confirmButtonText: 'La cambiaré!'
            })
        } else
            if (seeInput.map(e => e.sku).includes("") || seeInput.map(e => e.cantidad).includes(0)) {
                Swal.fire({
                    title: 'Error',
                    text: "Hay campos incompletos, por favor revísalos",
                    icon: 'error',
                    confirmButtonColor: 'red',
                    confirmButtonText: 'Entendido'
                })
            } else
            if(orderId < 0) {
                Swal.fire({
                    title: 'Error',
                    text: "No se permiten ID's con números inferiores a 0",
                    icon: 'error',
                    confirmButtonColor: 'red',
                    confirmButtonText: 'Entendido'
                })
            } else {
                dispatch(addOrder({ id: orderId, productos: seeInput }))
                Swal.fire({
                    title: 'Listo',
                    text: "La orden ha sido agregada correctamente y ya puedes verla en pantalla",
                    icon: 'success',
                    confirmButtonColor: 'green',
                    confirmButtonText: 'Muy bien!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        closeOrderModal()
                    }
                })
            }
    }
    
    const updateOrder = async () => {
        const inputsFiltereds = []
        manyUpdatesForm.map((e, i) => !idRetainer.includes(document.getElementById(i + "skuUpdate").id) &&
            inputsFiltereds.push({
                sku: document.getElementById(i + "skuUpdate").value,
                cantidad: Number(document.getElementById(i + "cantidadUpdate").value)
            })
        )
        if (inputsFiltereds.map(e => e.sku).includes("") || inputsFiltereds.map(e => e.cantidad).includes(0)) {
            Swal.fire({
                title: 'Error',
                text: "Hay campos incompletos, por favor revísalos",
                icon: 'error',
                confirmButtonColor: 'red',
                confirmButtonText: 'Entendido'
            })
        } else {
            await axios.put("http://localhost:3001/orden/" + formId, { productos: inputsFiltereds })
            Swal.fire({
                title: 'Completado',
                text: "Los productos solicitados fueron añadidos con éxito",
                icon: 'success',
                confirmButtonColor: 'green',
                confirmButtonText: 'Genial!'
            }).then((result) => {
                if (result.isConfirmed) {
                    dispatch(getOrders())
                    closeForm()
                }
            })
        }
    }

    const handleDelete = async (id) => {
        dispatch(deleteOrder(id))
        Swal.fire({
            title: 'Listo',
            text: "La orden fue eliminada correctamente",
            icon: 'success',
            confirmButtonColor: 'green',
            confirmButtonText: 'Muy bien!'
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(getOrders())
            }
        })
    }
    
    //AÑADIR ORDEN
    const addInput = (e) => {
        const newInput = new Array(orderForm + 1)
        newInput.fill(2, 0)
        setOrderForm(orderForm + 1)
        setManyOrderForms(newInput)
    }
    
    const removeInput = (e) => {
        if (orderForm > 1) {
            const updatedInput = new Array(orderForm - 1)
            updatedInput.fill(2, 0)
            setOrderForm(orderForm - 1)
            setManyOrderForms(updatedInput)
        } else {
            Swal.fire({
                title: 'Oops!',
                text: "Debes agregar al menos 1 producto",
                icon: 'warning',
                confirmButtonColor: 'orange',
                confirmButtonText: 'Entendido'
            })
        }
    }
    
    const openOrderModal = () => {
        setOrderModalShows(true)
        let nodelist1 = Array.from(document.getElementsByName("addProductsBtn"))
        nodelist1.map(e => e.style.zIndex = "-1")
        let nodelist2 = Array.from(document.getElementsByName("viewProductsBtn"))
        nodelist2.map(e => e.style.zIndex = "-1")
        let nodelist3 = Array.from(document.getElementsByName("deleteProductsBtn"))
        nodelist3.map(e => e.style.zIndex = "-1")
        let nodelist4 = Array.from(document.getElementsByName("addOrderBtn"))
        nodelist4.map(e => e.style.zIndex = "-1")
    }

    const closeOrderModal = () => {
        setOrderModalShows(false)
        let nodelist1 = Array.from(document.getElementsByName("addProductsBtn"))
        nodelist1.map(e => e.style.zIndex = "0")
        let nodelist2 = Array.from(document.getElementsByName("viewProductsBtn"))
        nodelist2.map(e => e.style.zIndex = "0")
        let nodelist3 = Array.from(document.getElementsByName("deleteProductsBtn"))
        nodelist3.map(e => e.style.zIndex = "0")
        let nodelist4 = Array.from(document.getElementsByName("addOrderBtn"))
        nodelist4.map(e => e.style.zIndex = "0")
        setManyOrderForms([null])
        setOrderForm(1)
        document.getElementsByName("orderIdInput")[0].value = ""
        manyOrderForms.map((e, i) => {
            document.getElementById(i + "sku").value = ""
            document.getElementById(i + "cantidad").value = ""
        })
    }

    //AÑADIR PRODUCTO
    const addUpdateInput = (e) => {
        const newInput = new Array(showManyForms + 1)
        newInput.fill(2, 0)
        setShowManyForms(showManyForms + 1)
        setManyUpdatesForm(newInput)
    }
    
    const removeThisInput = (indexId) => {
        setIdRetainer([...idRetainer, indexId])
    }

    const handleForm = (e) => {
        setformId(e.id)
        setShowForm(true)
        let nodelist1 = Array.from(document.getElementsByName("addProductsBtn"))
        nodelist1.map(e => e.style.zIndex = "-1")
        let nodelist2 = Array.from(document.getElementsByName("viewProductsBtn"))
        nodelist2.map(e => e.style.zIndex = "-1")
        let nodelist3 = Array.from(document.getElementsByName("deleteProductsBtn"))
        nodelist3.map(e => e.style.zIndex = "-1")
        let nodelist4 = Array.from(document.getElementsByName("addOrderBtn"))
        nodelist4.map(e => e.style.zIndex = "-1")
        setIdRetainer([])
    }

    const closeForm = () => {
        let skues = Array.from(document.getElementsByName("sku"))
        skues.map(e => e.value = "")
        let quantities = Array.from(document.getElementsByName("cantidad"))
        quantities.map(e => e.value = "")
        let nodelist1 = Array.from(document.getElementsByName("addProductsBtn"))
        nodelist1.map(e => e.style.zIndex = "0")
        let nodelist2 = Array.from(document.getElementsByName("viewProductsBtn"))
        nodelist2.map(e => e.style.zIndex = "0")
        let nodelist3 = Array.from(document.getElementsByName("deleteProductsBtn"))
        nodelist3.map(e => e.style.zIndex = "0")
        let nodelist4 = Array.from(document.getElementsByName("addOrderBtn"))
        nodelist4.map(e => e.style.zIndex = "0")
        setShowForm(false)
        setManyUpdatesForm([null])
        setShowManyForms(1)
        manyUpdatesForm.map((e, i) => {
            document.getElementById(i + "sku").value = ""
            document.getElementById(i + "cantidad").value = ""
        })
        setIdRetainer([])
    }
    
    //VER PRODUCTOS
    const handleProducts = (e) => {
        setShowProducts(true)
        setProductsShowing(e.productos)
        document.getElementsByName("productsModal")[0].style.display = "flex"
        let nodelist1 = Array.from(document.getElementsByName("addProductsBtn"))
        nodelist1.map(e => e.style.zIndex = "-1")
        let nodelist2 = Array.from(document.getElementsByName("viewProductsBtn"))
        nodelist2.map(e => e.style.zIndex = "-1")
        let nodelist3 = Array.from(document.getElementsByName("deleteProductsBtn"))
        nodelist3.map(e => e.style.zIndex = "-1")
        let nodelist4 = Array.from(document.getElementsByName("addOrderBtn"))
        nodelist4.map(e => e.style.zIndex = "-1")
    }

    const closeModal = () => {
        setShowProducts(false)
        document.getElementsByName("productsModal")[0].style.display = "none"
        let nodelist1 = Array.from(document.getElementsByName("addProductsBtn"))
        nodelist1.map(e => e.style.zIndex = "0")
        let nodelist2 = Array.from(document.getElementsByName("viewProductsBtn"))
        nodelist2.map(e => e.style.zIndex = "0")
        let nodelist3 = Array.from(document.getElementsByName("deleteProductsBtn"))
        nodelist3.map(e => e.style.zIndex = "0")
        let nodelist4 = Array.from(document.getElementsByName("addOrderBtn"))
        nodelist4.map(e => e.style.zIndex = "0")
    }

    //HTML
    return (
        <div className={Style.generalContainer}>
            <div className={Style.addOrderBtnContainer}>
                <button className={Style.addOrderButton} onClick={() => openOrderModal()} name="addOrderBtn">AGREGAR ORDEN</button>
            </div>
            <div className={Style.listContainer}>
                {
                    orders.length > 0 && orders.map(e => {
                        return (
                            <div className={Style.cardContainer}>
                                <div className={Style.idContainer}>
                                    <h3 className={Style.id}>Id de orden: {e.id}</h3>
                                </div>
                                <div className={Style.productsContainer}>
                                    <h3 className={Style.products}>Cantidad de productos: {e.productos.length}</h3>
                                </div>
                                <div className={Style.addButtonContainer}>
                                    <button className={Style.viewButton} name="addProductsBtn" value={e.id} onClick={() => handleForm(e)}>Añadir productos</button>
                                </div>
                                <div className={Style.viewButtonContainer}>
                                    <button className={Style.viewButton} name="viewProductsBtn" onClick={() => handleProducts(e)} value={e}>Ver productos</button>
                                </div>
                                <div className={Style.deleteButtonContainer}>
                                    <button className={Style.deleteButton} name="deleteProductsBtn" onClick={() => handleDelete(e.id)}>X</button>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <div name="productsModal" className={Style.productsModal} style={showProducts === false ? { display: "none" } : { display: "flex" }}>
                <div className={Style.modalInfoContainer}>
                    {
                        productsShowing.length > 0 ? productsShowing.map((e, index) => {
                            return (
                                <div className={Style.modalColumn}>
                                    <div className={Style.modalRow}>
                                        <h3 className={Style.indexer}>{index + 1} - </h3>
                                        <h3 className={Style.skuText}>Sku: {e.sku}</h3>
                                        <h3 className={Style.quantityText}>Cantidad: {e.cantidad}</h3>
                                    </div>
                                    <hr className={Style.hrSub} />
                                </div>
                            )
                        })
                            :
                            <h2>Esta orden se encuentra vacía</h2>
                    }
                </div>
                <div className={Style.closeButtonContainer}>
                    <button className={Style.closeButtonModal} onClick={() => closeModal()}>Cerrar</button>
                </div>
            </div>
            <div className={Style.addOrderModal} style={orderModalShows === true ? { display: "flex" } : { display: "none" }}>
                <div className={Style.addOrderColumns}>
                    <div className={Style.addOrderRows}>
                        <div className={Style.idInputContainer}>
                            <label className={Style.addOrderLabel}>Elige el Id:</label>
                            <input className={Style.addOrderInputId} min="0" type="number" name="orderIdInput"></input>
                        </div>
                    </div>
                    {
                        manyOrderForms.map((e, i) => {
                            return (
                                <div className={Style.addOrderInputsContainer}>
                                    <div className={Style.addOrderInputSku}>
                                        <label className={Style.label}>Sku:</label>
                                        <input className={Style.addOrderInput} type="text" id={i + "sku"} name="sku"></input>
                                    </div>
                                    <div className={Style.addOrderInputQuantity}>
                                        <label className={Style.label}>Cantidad:</label>
                                        <input className={Style.addOrderInput} type="number" min="0" id={i + "cantidad"} name="cantidad"></input>
                                    </div>
                                </div>
                            )
                        })
                    }
                    <div className={Style.addAnotherInputButtonContainer}>
                        <button className={Style.addAnotherInputButton} onClick={() => addInput()}>Agregar otro</button>
                        <button className={Style.addAnotherInputButton} onClick={() => removeInput()}>Borrar último</button>
                    </div>
                </div>
                <div className={Style.addOrderButtonsContainer}>
                    <button className={Style.orderButtons} onClick={() => postNewOrder()}>Añadir</button>
                    <button className={Style.orderButtons} onClick={() => closeOrderModal()}>Cerrar</button>
                </div>
            </div>
            <div className={Style.formModal} style={showForm === false ? { display: "none" } : { display: "flex" }}>
                <div className={Style.formContainer}>
                    {
                        manyUpdatesForm.map((e, i) => {
                            return (
                                <div className={Style.addOrderInputsContainer} style={idRetainer.includes(i + "skuUpdate") ? { display: "none" } : { display: "flex" }}>
                                    <div className={Style.addOrderInputSku}>
                                        <label className={Style.label}>Sku:</label>
                                        <input className={Style.addOrderInput} type="text" id={i + "skuUpdate"} name="sku"></input>
                                    </div>
                                    <div className={Style.addOrderInputQuantity}>
                                        <label className={Style.label}>Cantidad:</label>
                                        <input className={Style.addOrderInput} type="number" min="0" id={i + "cantidadUpdate"} name="cantidad"></input>
                                    </div>
                                    {
                                    i > 0 ?
                                    <div className={Style.deleteOrderButtonContainer}>
                                        <button className={Style.deleteOrderButton} onClick={() => removeThisInput(i + "skuUpdate")}>-</button>
                                    </div>
                                    :
                                    <div className={Style.deleteOrderButtonContainer}>
                                        <button className={Style.deleteOrderButtonInvisible}>-</button>
                                    </div>
                                    }
                                </div>
                            )
                        })
                    }
                    <div className={Style.addAnotherButtonContainer}>
                        <button className={Style.addAnotherButton} onClick={() => addUpdateInput()}>Añadir más</button>
                    </div>
                </div>
                <div className={Style.closeButtonContainer}>
                    <div className={Style.closeButtonSeparation}>
                        <button className={Style.closeButton} onClick={() => updateOrder()}>Añadir</button>
                    </div>
                    <div className={Style.closeButtonSeparation}>
                        <button className={Style.closeButton} onClick={() => closeForm()}>Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
