import { useState, useEffect, useCallback } from 'react';
import { ScaleProps, ScaleMarkerType } from './types';
import ScaleMarker from "./ScaleMarker";

/**
 * маркер который не подходит под рамер шага, будет не кликабельный,
 * такой маркер может возникнуть в конце трека.
 */

function Scale({min, max, stepInPercent, isVertical=false, onMarkerCkick}: ScaleProps) {
    const [markers, setMarkers] = useState<Array<ScaleMarkerType>>([]);

    const createMarkers = useCallback(
        function createMarkers() {
            const trueMax = Math.abs(max - min);
            const markers: Array<ScaleMarkerType> = [];
            const markerStepInValue = trueMax * (stepInPercent / 100);
        
            for (let i = 0; i <= 100; i += stepInPercent) {
                const value = Math.round(
                    markerStepInValue
                    * Math.round((i / 100) * ((max - min) / markerStepInValue)) + min,
                );
    
                const marker: ScaleMarkerType = {
                    value,
                    style: {
                        bottom: isVertical ? `${i}%` : 'auto',
                        left: isVertical ? 'auto' : `${i}%`,
                        pointerEvents: 'auto',
                    }
                }
                       
                markers.push(marker);
                if (i === 100) break; // это нужно для того чтобы не создавалось два одинаковых маркера на последнем месте (один кликабельный другой нет)
            
                if ((100 - stepInPercent) < i) { // создаём не кликабельный маркер
                    const disabledMarker: ScaleMarkerType = {
                        value: max,
                        style: {
                            bottom: isVertical ? i : 'auto',
                            left: isVertical ? 'auto' : '100%',
                            pointerEvents: 'none',
                        }
                    }
                    markers.push(disabledMarker);
                }
            }
            setMarkers(markers);
        },
        [min, max, stepInPercent, isVertical]
    );

    
    
    useEffect(() => {
        createMarkers();
    }, [createMarkers]);

    return (
        <div className="scale">
            {
                markers.map((marker, index) => {
                    return (
                        <ScaleMarker
                            key={index}
                            value={marker.value}
                            style={marker.style}
                            onClick={onMarkerCkick}
                        />
                    )
                })
            } 
        </div>
    )
}

export default Scale;