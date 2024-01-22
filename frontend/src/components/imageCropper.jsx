import React, { useState } from "react";
import Cropper from "react-easy-crop";

import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

function ImageCropper({ image, onCropDone, onCropCancel, buttonCancelProps={}, buttonDoneProps={} }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);
  const aspectRatio = 4 / 3;

  const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };


  return (
        <Paper elevation={10} sx={{ overflow: "hidden", borderRadius: "2rem", height: "80vmin", width: "80vmin", position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 1000000  }}>
        <Stack className="cropper"
        alignItems="center"
        sx={{height: "100%", width: "100%" }}
        >
            <Box sx={{ width: "100%", flexGrow: 1, position: "relative", backgroundColor: "#ffffff" }}>
                <Cropper
                    image={image}
                    aspect={aspectRatio}
                    crop={crop}
                    zoom={zoom}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                    showGrid={false}
                    style={{
                        containerStyle: {
                            width: "100%",
                            height: "100%",
                            backgroundColor: "#ffffff",
                        },
                    }}
                />
            </Box>
        </Stack>
    </Paper>
  );
}

export default ImageCropper;
