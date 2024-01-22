import { getProducts } from "../api"
import ProductListView from "./productListView"
import { useActionData } from "react-router-dom"

import IconButton from "@mui/material/IconButton"
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import { useEffect, useState } from "react";

export default function SelectProducts({ products, selectedProductIdState: [selectedProductsId, setSelectedProductsId] = useState([]) }) {


    function SelectProductCardAction({ product }) {
        const isSelected = selectedProductsId.includes(product.id) 
        return (
            <IconButton onClick={() => {
                if (isSelected) {
                    setSelectedProductsId(old => old.filter(id => id!==product.id))
                } else {
                setSelectedProductsId(old => [...old, product.id])
                }
            }}>
                {isSelected ? <CheckCircleIcon /> : <CheckCircleOutlinedIcon />}
            </IconButton>
        )
    }

    return (
        <ProductListView products={products} productItemProps={{ ProductCardActions: SelectProductCardAction }} />
    )
}