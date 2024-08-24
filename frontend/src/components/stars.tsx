import React from "react"

import Stack from "@mui/material/Stack"
import Box from "@mui/material/Box"

function Stars({ rating, id, orientation="horizontal", fill = "#FFFF61", stroke = "#FFFF93", emptyFill=null }:
 { rating: number, id: string, orientation: "horizontal" | "vertical", fill: string, stroke: string, emptyFill: null | string }) {
    if (!id) {throw new Error("Provide a id in the stars component")}
    const floored_rating = Math.floor(rating)
    const length_of_mapped_rating = ((floored_rating===rating) ? floored_rating : floored_rating+1)
    const mapped_rating = Array.from({ length: length_of_mapped_rating }, (_, i) => {
      const return_value = Math.min(1, Math.round((rating-(i)) * 10) / 10)
      return return_value
    })

    const new_id = id.replace(/ /g, "")

    const vertical = orientation==="vertical"
    return (
        mapped_rating.map((fillAmount, index) => (
          <Box key={index} sx={{ height: "100%", aspectRatio: 1/1 }}>
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 48 48" xmlSpace="preserve">
        <defs>
          <clipPath id={`star.clippath.${index}.${new_id}`}>
            <path d="M36.5,46.3c-0.5,0-0.9-0.1-1.4-0.3l-9.1-4.8c-0.6-0.3-1.3-0.5-2.1-0.5s-1.4,0.2-2.1,0.5l-9.1,4.8
            c-0.4,0.2-0.9,0.3-1.4,0.3c-0.9,0-1.7-0.4-2.3-1.1c-0.6-0.7-0.8-1.5-0.6-2.4l1.7-10.1c0.2-1.4-0.2-2.9-1.3-3.9l-7.4-7.2
            c-0.8-0.8-1.1-1.9-0.7-3c0.4-1.1,1.2-1.8,2.4-2L13.5,15c1.4-0.2,2.7-1.1,3.3-2.4l4.6-9.2c0.5-1,1.5-1.6,2.7-1.6
            c1.2,0,2.1,0.6,2.7,1.6l4.5,9.2c0.6,1.3,1.9,2.2,3.3,2.4l10.2,1.5c1.1,0.2,2,0.9,2.4,2c0.4,1.1,0.1,2.2-0.7,3L39,28.7
            c-1,1-1.5,2.5-1.3,3.9l1.7,10.1c0.2,0.9-0.1,1.7-0.6,2.4C38.3,45.9,37.4,46.3,36.5,46.3z"/>
          </clipPath>
        </defs>
        {emptyFill && <rect fill={emptyFill} width="100%" height="100%" x={vertical ? "0" : `${fillAmount*100}%`} y={vertical ? `${fillAmount*100}%` : "0"} clipPath={`url(#${`star.clippath.${index}.${new_id}`})`} />}
        <rect width={vertical ? "100%" : `${fillAmount*100}%`} height={vertical ? `${fillAmount*100}%` : "100%"} x="0" y="0" fill="#FFFF61" clipPath={`url(#${`star.clippath.${index}.${new_id}`})`} />
        <path fill={stroke} d="M24,2.5c0.9,0,1.6,0.5,2,1.2l4.5,9.2c0.8,1.5,2.2,2.6,3.9,2.8l10.2,1.5c0.9,0.1,1.5,0.7,1.8,1.5
          c0.3,0.8,0.1,1.7-0.6,2.3l-7.4,7.2c-1.2,1.2-1.8,2.9-1.5,4.6l1.7,10.1c0.1,0.7-0.1,1.3-0.5,1.8c-0.4,0.5-1.1,0.8-1.7,0.8
          c-0.4,0-0.7-0.1-1-0.3l-9.1-4.8c-0.7-0.4-1.6-0.6-2.4-0.6s-1.7,0.2-2.4,0.6l-9.1,4.8c-0.3,0.2-0.7,0.3-1,0.3
          c-0.6,0-1.3-0.3-1.7-0.8c-0.4-0.5-0.6-1.1-0.5-1.8L11,32.8c0.3-1.7-0.3-3.4-1.5-4.6L2.2,21c-0.6-0.6-0.8-1.5-0.6-2.3
          c0.3-0.8,0.9-1.4,1.8-1.5l10.2-1.5c1.7-0.2,3.1-1.3,3.9-2.8L22,3.7C22.4,2.9,23.1,2.5,24,2.5 M24,1c-1.3,0-2.6,0.7-3.3,2.1
          l-4.5,9.2c-0.5,1.1-1.6,1.8-2.8,2L3.2,15.8c-3,0.4-4.2,4.2-2.1,6.3l7.4,7.2c0.9,0.9,1.3,2.1,1.1,3.3L7.8,42.7
          C7.4,45.1,9.3,47,11.5,47c0.6,0,1.2-0.1,1.7-0.4l9.1-4.8c0.5-0.3,1.1-0.4,1.7-0.4s1.2,0.1,1.7,0.4l9.1,4.8
          c0.6,0.3,1.2,0.4,1.7,0.4c2.2,0,4.1-1.9,3.6-4.3l-1.7-10.1c-0.2-1.2,0.2-2.4,1.1-3.3l7.4-7.2c2.2-2.1,1-5.9-2.1-6.3l-10.2-1.5
          c-1.2-0.2-2.2-0.9-2.8-2l-4.5-9.2C26.6,1.7,25.3,1,24,1L24,1z"/>
      </svg>
          </Box>
        ))
    )
}



export default Stars