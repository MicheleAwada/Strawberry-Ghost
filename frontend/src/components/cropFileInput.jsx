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


	const onCropDone = (imgCroppedArea) => {
        setImgCropInfo(imgCroppedArea)
        
		const canvasEle = document.createElement("canvas");
		canvasEle.width = imgCroppedArea.width;
		canvasEle.height = imgCroppedArea.height;
        
		const context = canvasEle.getContext("2d");
        
		let imageObj1 = new Image();
		imageObj1.src = image;
		imageObj1.onload = function () {
            context.drawImage(
                imageObj1,
				imgCroppedArea.x,
				imgCroppedArea.y,
				imgCroppedArea.width,
				imgCroppedArea.height,
				0,
				0,
				imgCroppedArea.width,
				imgCroppedArea.height
                );
                
                const dataURL = canvasEle.toDataURL("image/jpeg");
                
                setImgAfterCrop(dataURL);
                setCurrentPage("img-cropped");
            };
        };

        const fileInputRef = useRef()
        function reset_input(element) {
            element.value = null
        }
        
        // Handle Cancel Button Click
        const onCropCancel = () => {
            setCroppedDataValue(baseState)
            reset_input(fileInputRef.current)
        };
        
        return (
            <Box>
            {currentPage === "img-cropped" && <Box>
                <input type="hidden" value={imgCropInfo.x} name={cropInfoInputsName.x} />
                <input type="hidden" value={imgCropInfo.y} name={cropInfoInputsName.y} />
                <input type="hidden" value={imgCropInfo.width} name={cropInfoInputsName.width} />
                <input type="hidden" value={imgCropInfo.height} name={cropInfoInputsName.height} />
            </Box>}
            <FileInput onImageSelected={onImageSelected} inputRef={fileInputRef} hideButton={currentPage!=="choose-img"} {...fileInputProps} />
			{currentPage === "crop-img" && (
				<ImageCropper
					image={image}
					onCropDone={onCropDone}
					onCropCancel={onCropCancel}
                    {...imageCropperProps}
				/>
			)}
            {currentPage === "img-cropped" && (
				<Stack flexDirection="row" gap={2} alignItems="center">

					<Button
						onClick={() => {
							setCurrentPage("crop-img");
						}}
						size="small"
						variant="outlined"
					>
						Crop Again
					</Button>
					<Button
						onClick={() => {
							onCropCancel()
						}}
						size="small"
						variant="outlined"
					>
						New Image
					</Button>
                    <Box
						component="img"
						alt="Cropped Image"
						sx={{ objectFit: "contain", height: "2rem", aspectRatio: 4 / 3 }}
						src={imgAfterCrop}
					/>
				</Stack>
			)}
		</Box>
	);
}

export default FileCropInput;
export { baseState };
