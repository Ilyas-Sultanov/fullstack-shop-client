import './Slider.scss';
import React, { useState, useRef, createElement, useLayoutEffect, CSSProperties } from 'react';
import { getTouchEventData } from './SliderUtils';
import { SliderItemType } from './SliderItem';
import SliderItem from './SliderItem';
import useStateRef from '../../../hooks/useStateRef';
import Button from '../Button/Button';
import {ReactComponent as ChevronLeftIcon} from './images/chevron-left.svg';
import {ReactComponent as ChevronRightIcon} from './images/chevron-right.svg';

type SliderProps = {
    items: Array<SliderItemType>
    visibleItemsCount?: number
    itemsGapPx?: number
    arrows?: boolean
    dots?: boolean
    isVertical?: boolean
    children?: never
};

const MIN_SWIPE_REQUIRED = 40; // Количество пикселей, на которые нужно сместит item чтобы отобразился весь следующий.

function Slider({ items, visibleItemsCount = 1, itemsGapPx, arrows, dots, isVertical }: SliderProps) {
    const trackRef = useRef<HTMLUListElement>(null);
    const [trackWidth, setTrackWidth] = useState(0);
    const [trackHeight, setTrackHeight] = useState(0);
    const minOffsetRef = useRef(0);
    const currentOffsetRef = useRef(0);
    const startRef = useRef(0);
    const [offset, setOffset, offsetRef] = useStateRef(0);
    const dotsCount = useRef( Array.from(Array(Math.ceil(items.length / visibleItemsCount)).keys()) );
    const [currentIdx, setCurrentIdx] = useState(0);


    useLayoutEffect(
        function() {
            if (trackRef.current) {
                setTrackWidth(trackRef.current.offsetWidth);
                setTrackHeight(trackRef.current.offsetHeight);
            }
        },
        []
    );
    

    function onTouchMove(e: TouchEvent | MouseEvent) {
        const currentCoord = isVertical ? getTouchEventData(e).clientY : getTouchEventData(e).clientX;

        const diff = startRef.current - currentCoord;
        let newOffset = currentOffsetRef.current - diff;

        const maxOffset = 0;

        if (newOffset > maxOffset) {
            newOffset = maxOffset;
        }

        if (newOffset < minOffsetRef.current) {
            newOffset = minOffsetRef.current;
        }

        setOffset(newOffset);
    };

  
    function onTouchEnd() {
        /**
         * После этого события, нужно выровнять item, чтобы он целиком был виден, и не видны части других слайдов.
         */
        let newOffset = offsetRef.current;
        /**
         * Если бы для хранения значения offsetXRef использовался обычный useState,
         * то здесь всё ещё было бы его старое значение, хук useStateRef решает эту проблему.
         */

        if (newOffset || newOffset === 0) {
            const diff = currentOffsetRef.current - newOffset;
            const sizeProp = isVertical ? trackHeight : trackWidth;

            // we need to check difference in absolute/positive value (if diff is more than 40px)
            if (Math.abs(diff) > MIN_SWIPE_REQUIRED) {
            if (diff > 0) {
                // swipe to the right if diff is positive
                newOffset = Math.floor(newOffset / sizeProp) * sizeProp;
            } else {
                // swipe to the left if diff is negative
                newOffset = Math.ceil(newOffset / sizeProp) * sizeProp;
            }
            } else {
                // remain in the current image
                newOffset = Math.round(newOffset / sizeProp) * sizeProp;
            }

            setOffset(newOffset);
            setCurrentIdx(Math.ceil(Math.abs(newOffset / sizeProp)));
        }
        
        window.removeEventListener('touchend', onTouchEnd);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('mouseup', onTouchEnd);
        window.removeEventListener('mousemove', onTouchMove);
    };

    function onTouchStart(e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) {
        currentOffsetRef.current = offset;

        if (trackRef.current && isVertical) {
            startRef.current = getTouchEventData(e).clientY;
            minOffsetRef.current = trackHeight - trackRef.current.scrollHeight;
        }
        else if (trackRef.current) {
            startRef.current = getTouchEventData(e).clientX;
            minOffsetRef.current = trackWidth - trackRef.current.scrollWidth;
        }

        window.addEventListener('touchmove', onTouchMove);
        window.addEventListener('touchend', onTouchEnd);
        window.addEventListener('mousemove', onTouchMove);
        window.addEventListener('mouseup', onTouchEnd);
    };

    function dotClickHandler(idx: number) {
        const trackEl = trackRef.current;
        if (trackEl) {
            const sizeProp = isVertical ? trackHeight : trackWidth;
            setCurrentIdx(idx);
            setOffset(-(sizeProp * idx));
        }
    };

    function slideTo(direction: 'left' | 'right') { // Для вертикального слайдера, left считай up, right считай down.
        const trackEl = trackRef.current;
        if (trackEl && (offsetRef.current || offsetRef.current === 0)) {

            if (trackRef.current && isVertical) {
                minOffsetRef.current = trackHeight - trackRef.current.scrollHeight;
            }
            else if (trackRef.current) {
                minOffsetRef.current = trackWidth - trackRef.current.scrollWidth;
            }

            let newOffset = 0;
            const maxOffset = 0;
            const sizeProp = isVertical ? trackHeight : trackWidth;

            if (direction === 'left') { // direction это направление которое указывает кнопка, а не направление движения слайдов 
                newOffset = offsetRef.current + sizeProp;
                if (newOffset > maxOffset) {
                    newOffset = maxOffset;
                }
            }
            else if (direction === 'right') {
                newOffset = offsetRef.current - sizeProp;
                if (newOffset < minOffsetRef.current) {
                    newOffset = minOffsetRef.current;
                }
            }
           
            setCurrentIdx(Math.ceil(Math.abs(newOffset / sizeProp)));
            setOffset(newOffset);
        }
    }


    // function getTrackStyle(): CSSProperties {
    //     if (isVertical) return {transform: `translate3d(0, ${offset}px, 0)`, rowGap: `${itemsGapPx / 2}px`}
    //     else return {transform: `translate3d(${offset}px, 0, 0)`, columnGap: `${itemsGapPx / 2}px`}
    // }


    // function getItemStyle(): CSSProperties {
    //     if (isVertical) return {height: trackHeight > 0 ? (trackHeight / visibleItemsCount) : 0}
    //     else return {width: trackWidth > 0 ? (trackWidth / visibleItemsCount) : 0}
    // }

    function getTrackStyle(): CSSProperties {
        if (isVertical) return {transform: `translate3d(0, ${offset}px, 0)`}
        else return {transform: `translate3d(${offset}px, 0, 0)`}
    }


    function getItemStyle(idx: number): CSSProperties {
        const style: CSSProperties = {};
        if (isVertical) {
            style.height = trackHeight > 0 ? (trackHeight / visibleItemsCount) : 0;
            if (itemsGapPx) {
                style.padding = `${itemsGapPx / 2}px 0`;
            }
        }
        else {
            style.width = trackWidth > 0 ? (trackWidth / visibleItemsCount) : 0;
            if (itemsGapPx) {
                style.padding = `0 ${itemsGapPx / 2}px`;
            }
        }
        return style;
    }


    return (
        <>
            <div
            className={`slider ${isVertical ? 'vertical' : 'horizontal'}`}
            tabIndex={0}
            onTouchStart={onTouchStart}
            onMouseDown={onTouchStart}
            onKeyDown={(e) => {
                const direction = e.key === 'ArrowLeft' ? 'left' : 'right';
                slideTo(direction);
            }}
        >
            {
                arrows ?
                    <Button 
                    className='slider-controll-buttons slider-prev'
                    onClick={() => slideTo('left')}
                >
                    <ChevronLeftIcon/>
                </Button> :
                ''
            }
           
            <ul
                ref={trackRef}
                className='slider-track'
                style={getTrackStyle()}
            >
                {
                    items.map((item, idx) => {
                        let el = item;
                        
                        if (item.type === 'img') {
                            el = createElement(
                                "img", 
                                { src: `${item.props.src}`, alt: `${item.props.alt}`, draggable: false, 'className': 'slider-img'},
                                null
                            );
                        }
                        
                        return (
                            <SliderItem 
                                key={idx}
                                style={getItemStyle(idx)}
                            >
                                {el}
                            </SliderItem>
                        )
                    })
                }
            </ul>
            {
                arrows ?
                    <Button 
                    className='slider-controll-buttons slider-next'
                    onClick={() => slideTo('right')}
                >
                    <ChevronRightIcon/>
                </Button> :
                ''
            }
        </div>

            {
                dots ?
                <ul className="slider-dots">
                    {
                        dotsCount.current.map((_, idx) => (
                            <li
                                key={idx}
                                className={`slider-dots-item ${currentIdx === idx ? 'active' : ''}`}
                                onClick={() => dotClickHandler(idx)}
                            />
                        ))
                    }
                </ul> :
                ''
            }
        </>
    );
}

export default Slider;




{/* <div className='product__slider'>
    <Slider 
        items={product.images.map((img, index) => {
            return (
                <img src={img} alt={`product-img${index+1}`}/>
            )
        })}
        // visibleItemsCount={3}
        // itemsGapPx={20}
        dots={true}
        arrows={true}
        // isVertical={true}
    />
</div> */}