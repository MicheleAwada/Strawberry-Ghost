import React, { useEffect, useRef, useState } from "react";
import FileInput from "./fileInputForCrop";
import ImageCropper from "./imageCropper";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

const baseState = {
    imgCropInfo: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    },
    rawImage: "",
    currentPage: "choose-img",
    image: "https://creativelittlewomen.com/wp-content/uploads/2021/11/IMG_2439.jpg",
}

function FileCropInput({ croppedData=null, setCroppedData=null, imageDisplayName="image", fileInputProps={}, imageCropperProps={}, cropInfoInputsName={x: "x", y: "y", width: "width", height: "height"} }) {
    if (croppedData===null && setCroppedData===null) {

        [croppedData, setCroppedData] = useState(baseState);
    }


    function setCroppedDataValue(data) {
        setCroppedData(oldData => ({...oldData, ...data}))
    }

    const currentPage = croppedData.currentPage
    function setCurrentPage(value) {
        setCroppedDataValue({currentPage: value})
    }

    const image = croppedData.rawImage
    function setImage(value) {
        setCroppedDataValue({rawImage: value})
    }
    
    const imgAfterCrop = croppedData[imageDisplayName]
    function setImgAfterCrop(value) {
        if ((value) === "") {
            value = "https://creativelittlewomen.com/wp-content/uploads/2021/11/IMG_2439.jpg"
        }
        setCroppedDataValue({[imageDisplayName]: value})
    }

    const imgCropInfo = croppedData.imgCropInfo
    function setImgCropInfo(value) {
        setCroppedDataValue({imgCropInfo: value})
    }






	const onImageSelected = (selectedImg) => {
        setImage(selectedImg);
		setCurrentPage("crop-img");
	};
