import { useEffect, useRef, useState } from "react";


export default function useImageRendering( querySelectorAll, imageSrcsIterable ) {
    const [loadAllImages, setLoadAllImages] = useState(false)
    let visibleImagesArray = useRef([])
    function checkImagesLoaded() {
        const allLoaded = visibleImagesArray.current.every((image) => image.complete);
        setLoadAllImages(allLoaded);
      };
    function addImagesEventListeners() {
        visibleImagesArray.current.forEach((image) => {
            image.addEventListener('load', checkImagesLoaded);
            image.addEventListener('error', checkImagesLoaded);
          });
    }
    function removeImagesEventListeners() {
        visibleImagesArray.current.forEach((image) => {
            image.removeEventListener('load', checkImagesLoaded);
            image.removeEventListener('error', checkImagesLoaded);
          });
    }
    function setVisibleImages(querySelectorAll) {
        const images = document.querySelectorAll(querySelectorAll);
        const imagesArray = Array.from(images);
        visibleImagesArray.current = imagesArray
    }
    
    const RenderToLoadImages = () => {
        return loadAllImages ? <div style={{ display: "none", flexDirection: "row", flexWrap: "wrap", gap: "1rem"}}>{imageSrcsIterable.map((imageSrc, index) => <img style={{width: "100px", height: "100px"}} key={[imageSrc, index]} className="currentColorImages" src={imageSrc} alt="hidden image for loading"/>)}</div> : null
    }
    const refreshClasses = (newQuerySelectorAll=querySelectorAll) => {
          removeImagesEventListeners()
          setVisibleImages(newQuerySelectorAll)
          addImagesEventListeners()
          return removeImagesEventListeners
        }
    useEffect(refreshClasses, []);
    return [RenderToLoadImages, refreshClasses]
}