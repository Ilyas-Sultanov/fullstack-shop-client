import './ProductImages.scss';
import { useCallback, useState, useRef, MouseEvent, useLayoutEffect, useEffect } from 'react';
import Button from '../../components/UI/Button/Button';
import {ReactComponent as PrevIcon} from './images/chevron-left.svg';
import {ReactComponent as NextIcon} from './images/chevron-right.svg';
import useStateRef from '../../hooks/useStateRef';

type ProductImagesProps = {
    urls: Array<string>
}

function ProductImages({urls}: ProductImagesProps) {
    const trackWrapperRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [offset, setOffset, offsetRef] = useStateRef(0);
    const minOffsetRef = useRef(0);
    const [trackWidth, setTrackWidth] = useState(0);
    const bigImageWrapper = useRef<HTMLDivElement>(null);
    const bigImage = useRef<HTMLImageElement>(null);
    const [selectedImgIdx, setSelectedImgIdx] = useState(0); 

    useLayoutEffect(
        function() {
            if (trackRef.current && trackWrapperRef.current) {
                setTrackWidth(trackRef.current.offsetWidth);
            }
        },
        []
    );

    useEffect(
        /**
         * При изменении размера экрана, нужно ререндерить компонент,
         * чтобы слайдер изображений имел корректную ширину.
         * Для этого меняем стейт trackWidth.
         */
        function() {
            function forceRerender() {
                if (trackRef.current) {
                    setTrackWidth(trackRef.current.offsetWidth)
                }
            }

            window.addEventListener('resize', forceRerender)

            return () => {
                window.removeEventListener('resize', forceRerender);
            }
        },
        []
    );

    function selectImage(imgIndex: number) {
        setSelectedImgIdx(imgIndex);
    }

    function zoomIn(e: MouseEvent<HTMLDivElement>) {
        if (bigImageWrapper.current && bigImage.current) {
            let clientX = e.clientX - bigImageWrapper.current.offsetLeft;
            let clientY = e.clientY - bigImageWrapper.current.offsetTop;
            const width = bigImageWrapper.current.offsetWidth;
            const height = bigImageWrapper.current.offsetHeight;
            clientX = clientX / width * 100;
            clientY = clientY / height * 100;
            bigImage.current.style.transform = `translate(${-clientX}%, ${-clientY}%) scale(2)`;
        }
    }

    function zoomOut() {
        if (bigImage.current) {
            bigImage.current.style.transform = `translate(-50%, -50%) scale(1)`;
        }
    }
    
    const slideTo = useCallback(
        function slideTo(direction: 'left' | 'right') { 
            const trackEl = trackRef.current;
            if (trackEl && (offsetRef.current || offsetRef.current === 0)) {
    
                if (trackRef.current) {
                    minOffsetRef.current = trackWidth - trackRef.current.scrollWidth;
                }
    
                let newOffset = 0;
                const maxOffset = 0;
                    
                if (direction === 'left') { // direction это направление которое указывает кнопка, а не направление движения слайдов 
                    newOffset = offsetRef.current + trackWidth;
                    
                    if (newOffset > maxOffset) {
                        newOffset = maxOffset;
                    }
                }
                else if (direction === 'right') {
                    newOffset = offsetRef.current - trackWidth;
    
                    if (newOffset < minOffsetRef.current) {
                        newOffset = minOffsetRef.current;
                    }
                }
               
                setOffset(newOffset);
            }
        },
        [offsetRef, setOffset, trackWidth]
    );

    return (
        <div className='product-images'>
            <div 
                ref={bigImageWrapper}
                className="product-images__big-image-wrapper"
                onMouseMove={zoomIn}
                onMouseLeave={zoomOut}
            >
                <img 
                    ref={bigImage}
                    src={urls[selectedImgIdx]} 
                    alt="selected-img" 
                    className='product-images__big-image'
                />
            </div>
            <div className="product-images__slider">
                <Button 
                    className='product-images__buttons btn-outline-primary'
                    onClick={() => slideTo('left')}
                    // disabled={offsetRef.current === 0}
                ><PrevIcon/></Button>
                               
                <div className='product-images__track-wrapper' ref={trackWrapperRef}>
                    <div 
                        className="product-images__track" 
                        ref={trackRef}
                        style={{transform: `translate3d(${offset}px, 0, 0)`}}
                    >
                    {
                        urls.map((url, index) => {
                            return (
                                <img 
                                    key={index}
                                    className={`product-images__small-image ${selectedImgIdx === index ? 'active' : ''}`}
                                    src={url} 
                                    alt={`product-img${index+1}`}
                                    onClick={() => selectImage(index)}
                                />
                            )
                        })
                    }
                    </div>
                </div>

                <Button 
                    className='product-images__buttons btn-outline-primary'
                    onClick={() => slideTo('right')}
                    // disabled={(offsetRef.current || offsetRef.current === 0) ? (offsetRef.current + trackWidth) > 0 : false}
                ><NextIcon/></Button>
            </div>
        </div>
    )
}

export default ProductImages;














// import './ProductImages.scss';
// import { useCallback, useState, useRef, MouseEvent } from 'react';
// import Button from '../../components/UI/Button/Button';
// import {ReactComponent as PrevIcon} from './images/chevron-left.svg';
// import {ReactComponent as NextIcon} from './images/chevron-right.svg';

// type ProductImagesProps = {
//     urls: Array<string>
// }

// function ProductImages({urls}: ProductImagesProps) {
//     const trackRef = useRef<HTMLDivElement>(null);
//     const scrollSizeRef = useRef(150); // Количество пикселей, на которые прокрутится слайдер, при нажатии на кнопку прокрутки у слайдера.
//     const bigImageWrapper = useRef<HTMLDivElement>(null);
//     const bigImage = useRef<HTMLImageElement>(null);
//     const [selectedImgIdx, setSelectedImgIdx] = useState(0);
//     const [isMinScroll, setIsMinScroll] = useState(true);
//     const [isMaxScroll, setIsMaxScroll] = useState(false);

    
//     const checkScroll = useCallback( // Задаём значение для атрибута disable у кнопок слайдера.
//         function(prevScroll?: number) {
//             /**
//              * У элемента trackRef.current в css задано свойство scroll-behavior: smooth;,
//              * что делает прокрутку плавной, но из-за этого пришлось обернуть проверку скрола в setTimeout.
//              * Когда проверяем скролл, мы получаем значение trackRef.current.scrollLeft, 
//              * а setTimeout позволяет взять значение когда анимация плавного скрола уже завершилась.
//              */
//             setTimeout(
//                 function() {
//                     if (trackRef.current) {
//                         if (prevScroll || prevScroll === 0) {
//                             if (
//                                 (trackRef.current.scrollLeft - scrollSizeRef.current) >= 0 &&
//                                 (trackRef.current.scrollLeft - scrollSizeRef.current) <= prevScroll && 
//                                 !isMaxScroll
//                             ) {
//                                 setIsMaxScroll(true);
//                             }
//                         }
//                         else {
//                             if (trackRef.current.scrollLeft <= 0 && !isMinScroll) {
//                                 setIsMinScroll(true);
//                             }
//                         }
//                     }
//                 },
//                 300
//             );
//         },
//         [isMinScroll, isMaxScroll]
//     );

//     const scrollLeft = useCallback(
//         function() {
//             if (trackRef.current) {
//                 if (isMaxScroll) {
//                     setIsMaxScroll(false);
//                 }

//                 trackRef.current.scrollLeft = trackRef.current.scrollLeft - scrollSizeRef.current; // При попытке установить скролл меньше чем минимально возможный, под капотом устанавливается минимально возможный (стандартное поведение браузера).
//                 checkScroll();
//             }
//         },
//         [isMaxScroll, checkScroll]
//     );

//     const scrollRight = useCallback(
//         function() {
//             if (trackRef.current) {
//                 if (isMinScroll) {
//                     setIsMinScroll(false);
//                 }

//                 const prevScroll = trackRef.current.scrollLeft;
//                 const newScroll = prevScroll + scrollSizeRef.current;
//                 trackRef.current.scrollLeft = newScroll; // При попытке установить скролл больше чем максимально возможный, под капотом устанавливается максимально возможный (стандартное поведение браузера).
//                 checkScroll(prevScroll);
//             }
//         },
//         [isMinScroll, checkScroll]
//     );

//     function selectImage(imgIndex: number) {
//         setSelectedImgIdx(imgIndex);
//     }

//     function zoomIn(e: MouseEvent<HTMLDivElement>) {
//         if (bigImageWrapper.current && bigImage.current) {
//             let clientX = e.clientX - bigImageWrapper.current.offsetLeft;
//             let clientY = e.clientY - bigImageWrapper.current.offsetTop;
//             const width = bigImageWrapper.current.offsetWidth;
//             const height = bigImageWrapper.current.offsetHeight;
//             clientX = clientX / width * 100;
//             clientY = clientY / height * 100;
//             bigImage.current.style.transform = `translate(${-clientX}%, ${-clientY}%) scale(2)`;
//         }
//     }

//     function zoomOut() {
//         if (bigImage.current) {
//             bigImage.current.style.transform = `translate(-50%, -50%) scale(1)`;
//         }
//     }

//     return (
//         <div className='product-images'>
//             <div 
//                 ref={bigImageWrapper}
//                 className="product-images__big-image-wrapper"
//                 onMouseMove={zoomIn}
//                 onMouseLeave={zoomOut}
//             >
//                 <img 
//                     ref={bigImage}
//                     src={urls[selectedImgIdx]} 
//                     alt="selected-img" 
//                     className='product-images__big-image'
//                 />
//             </div>
//             <div className="product-images__slider">
//                 <Button 
//                     className='product-images__buttons btn-outline-primary'
//                     onClick={scrollLeft}
//                     disabled={isMinScroll}
//                 ><PrevIcon/></Button>
                
//                 <div className="product-images__track" ref={trackRef}>
//                 {
//                     urls.map((url, index) => {
//                         return (
//                             <img 
//                                 key={index}
//                                 className={`product-images__small-image ${selectedImgIdx === index ? 'active' : ''}`}
//                                 src={url} 
//                                 alt={`product-img${index+1}`}
//                                 onClick={() => selectImage(index)}
//                             />
//                         )
//                     })
//                 }
//                 </div>
//                 <Button 
//                     className='product-images__buttons btn-outline-primary'
//                     onClick={scrollRight}
//                     disabled={isMaxScroll}
//                 ><NextIcon/></Button>
//             </div>
//         </div>
//     )
// }

// export default ProductImages;