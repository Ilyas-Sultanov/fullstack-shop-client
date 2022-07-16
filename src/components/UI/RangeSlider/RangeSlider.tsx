import './RangeSlider.scss';
import Bar from './Bar';
import Thumb from './Thumb';
import Scale from './Scale';
import React, { useState, useMemo, useEffect, useRef, /*useLayoutEffect,*/ useCallback } from 'react';
import { RangeSliderProps, BarType, ThumbType, RangeSliderValues } from './types';
import findClosestNumberInArray from '../../../helpers/findClosestNumberInArray';

/**
 * опция step:
 * Размер шага в единицах значения,
 * т.е. если максимальное значение 100, а размер шага 10,
 * кнопка будет передвигаться по треку только по следущим значениям:
 * 0-10-20-30-40-50-60-70-80-90-100
 */

/** опция tip:
 * если не указывать или указать false, то подсказки со значением у кнопки не будет
 */

/**
 * опция scale:
 * если не указывать или указать false, то линейки не будет,
 * если указать true - то значения линейки будут соответствовать размеру шага,
 * если указать число от 0 до 100 - это будет процент от ширины трека на котором будет значение линейки
 * (т.е. указав 25 - это значит что значения будут показываться каждые 25% от ширины трека)
 */

/** опция bar:
 * если указать false, то бара не будет, если указать true или ничего не указать, то бар будет
 */

function RangeSlider({min, max, values, step=1, tip, scale, bar=true, isVertical=false, onChangeValues}: RangeSliderProps) {
    const rangeSliderRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [thumbs, setThumbs] = useState<Array<ThumbType>>([]);
    const [bars, setBars] = useState<Array<BarType>>([]);


    const calculateStepInPercent = useCallback(
        function() {
            // Расчет размера шага в процентах от ширины/высоты трека
            const stepInPercent = typeof scale === 'number'
            ? scale
            : (step / Math.abs(max - min)) * 100;
    
            return stepInPercent;
        }, 
        [min, max, step, scale]
    );


    const stepInPercent = useMemo(() => {
        return calculateStepInPercent();
    }, [calculateStepInPercent]);


    const calculatePositionFromValue = useCallback(
        function calculatePositionFromValue(value: number) {
            // формула для расчета позиции, зная значение (результат - позиция в виде коэффициента)
            const position = (value - min) / (max - min);
            return position * 100;
        }, 
        [min, max]
    );


    const calculateValueFromPosition = useCallback(
        function(position: number) { // позиция приходит в виде коэффициента (десятичное число от 0 до 1)
            // формула для расчета значения, зная позицию
            const value = step * Math.round((position * (max - min)) / step) + min;
            if (value >= min && value <= max) return value;
            return null;
        },
        [step, min, max]
    );
     
    const getCorrectedValues = useCallback(
        function getCorrectedValues() {
            /*
              Этот метод срабатывает когда:
              1) корректируем значения, которые получили при создании слайдера,
                чтобы они совпадали со значениями которые получаем при текущем шаге
              2) Значения нужно корректировать если изменился шаг
            */
            let lastValue: number
            
            for (let i = 0; i <= 100; i += stepInPercent) {
                const value = calculateValueFromPosition(i / 100);
                if (value !== null) lastValue = value;
            }
    
            const correctedValues: Array<number> = [];
            for(let i=0; i<values.length; i+=1) {
                const position = calculatePositionFromValue(values[i]);
                let value = calculateValueFromPosition(position / 100);
                if (value === null) value = lastValue!;
                correctedValues.push(value);
            }    
            return correctedValues;
        }, 
        [values, stepInPercent, calculateValueFromPosition, calculatePositionFromValue]
    );


    const correctedValues = useMemo(() => {
        /**
         * Переданные values всегда корректируются (изменяются), чтобы соответствовать размеру шага,
         * если не использовать useMemo, получается бесконечная петля
         */
        return getCorrectedValues();
    }, [getCorrectedValues]);


    // useLayoutEffect(() => {
    //     if (rangeSliderRef.current) {
    //         // Чтобы во время движения кнопок не происходило выделение на странице, нужно отключить событие onselectstart
    //         rangeSliderRef.current.onselectstart = () => false;
    //     }
    // }, []);


    const validateProps = useCallback(
        function validateProps() {
            if ( step > (Math.abs(min) + Math.abs(max)) ) {
                throw new Error('Размер шага превышает ширину трека.');
            }
            for (let i=0; i<values.length; i+=1) {
                if (values[i] < min) throw new Error(`Значение ${values[i]} меньше минимального значения слайдера`);
                if (values[i] > max) throw new Error(`Значение ${values[i]} больше максимального значения слайдера`);
            }
        },
        [step, min, max, values]
    );
    

    useEffect(() => {
        validateProps();        
    }, [validateProps]);


    const calculateThumbTransformStyles = useCallback(
        function(position: number) {
            const thumbTransform = isVertical
              ? `translate(0%, ${-position}%)`
              : `translate(${position - 100}%, -50%)`;
            return thumbTransform;
        }, 
        [isVertical]
    );

    const calculateBarTransformStyles = useCallback(
        function(position1: number, position2?: number) {
            let position: number;
            let cssScale: number;             
        
            if (position2) {
                position = position1;
                cssScale = (position2 - position1) / 100;
            } else {
                position = 0;
                cssScale = position1 / 100;
            }
        
            const barTransform = isVertical
                ? `translate(0%, ${-position}%) scale(1, ${cssScale})`
                : `translate(${position}%, -50%) scale(${cssScale}, 1)`;
            return barTransform;
        },
        [isVertical]
    );


    useEffect(() => {
        const thumbsData: Array<ThumbType> = [];
        const barsData: Array<BarType> = [];
        
        function fillThumbsData(i: number) {
            const position = calculatePositionFromValue(correctedValues[i]);
            const thumbData = {
                cssTransform: calculateThumbTransformStyles(position),
                value: correctedValues[i],
            };
            thumbsData.push(thumbData);
        };
      
        function fillBarsData(i: number) {
            let cssTransform: string;
            const position1 = calculatePositionFromValue(correctedValues[i]);
            const position2 = calculatePositionFromValue(correctedValues[i + 1]);
            // Если correctedValues[i + 1] === undefined, то position2 === NaN
            
            if (!isNaN(position2)) { 
                cssTransform = calculateBarTransformStyles(position1, position2);
            }
            else cssTransform = calculateBarTransformStyles(position1);
            barsData.push({
                cssTransform,
            });
        };
      
        for (let i = 0; i < correctedValues.length; i += 1) {
            if (bar && i === 0) {
                // Когда кнопка одна, бар должен быть привязан к левому краю div коньейнера (трека), и он должен растягиваться (scale) до кнопки.
                fillBarsData(i);
            }
            
            if (bar && i>1) {
                // Если кнопок больше, то левый край бара должен быть привязан к кнпке, и он должен растягиваться (scale) до ближайшей справа кнопки.
                fillBarsData(i-1);
            }
            fillThumbsData(i);
        }

        setThumbs(thumbsData);
        setBars(barsData);
    }, [bar, correctedValues, calculatePositionFromValue, calculateThumbTransformStyles, calculateBarTransformStyles]);

  
    

    const moveHandler = useCallback((thumbIndex: number, position: number) => {
        const value = calculateValueFromPosition(position);
        if (value === 0 || value) {
            const newValues: RangeSliderValues = [...values];
            newValues[thumbIndex] = value;
        
            if (newValues.length > 1) newValues.sort((va, vb) => va! - vb!); // сортировка массива значений по возрастанию
            onChangeValues(newValues);
        }
    }, [onChangeValues, calculateValueFromPosition, values]);

 

    const scaleMarkerClickHandler = useCallback((markerValue: number) => { 
        // Без зависимости correctedValues в useCallback, значения кнопок по которым в данный момент не щелкнули, меняются на их старое значение
        const indexOfClosestValue = findClosestNumberInArray(correctedValues, markerValue).idx;
        const newValues: RangeSliderValues = [...correctedValues];
        newValues[indexOfClosestValue] = markerValue;
        onChangeValues(newValues);
    }, [onChangeValues, correctedValues]);


    return (
        <div 
            ref={rangeSliderRef}
            className={`range-slider ${isVertical ? 'vertical' : 'horizontal'} ${tip ? 'withTip' : ''} ${scale ? 'withScale' : ''}`} 
        >
            <div className="range-slider__track" ref={trackRef}>                
                <div className="bars-wrapper">
                    {
                        bar && bars.length && 
                        bars.map((bar, index) => {
                            return (
                                <Bar 
                                    key={index}
                                    barIndex={index}
                                    cssTransform={bar.cssTransform}
                                />
                            )
                        })
                    }
                </div>
                {
                    thumbs.map((thumb, index) => {
                        return (
                            <Thumb
                                key={index}
                                trackElement={trackRef.current}
                                tip={tip}
                                value={thumb.value}
                                cssTransform={thumb.cssTransform}
                                zIndex={index+2}
                                thumbIndex={index}
                                isVertical={isVertical}
                                onMove={moveHandler}
                            />
                        )
                    })
                }
                {
                    scale && 
                    <Scale
                        stepInPercent={stepInPercent}
                        min={min}
                        max={max}
                        onMarkerCkick={scaleMarkerClickHandler}
                        isVertical={isVertical}
                    />
                }
            </div>
        </div>
    )
}

export default React.memo(RangeSlider);