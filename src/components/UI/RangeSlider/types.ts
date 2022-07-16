import { CSSProperties } from 'react';
export type RangeSliderValues = Array<number>

export type RangeSliderProps = {
    min: number
    max: number
    values: RangeSliderValues
    step?: number
    tip?: boolean
    scale?: number | boolean
    bar?: boolean
    isVertical?: boolean
    onChangeValues: (values: RangeSliderValues) => void
}

export type ThumbType = {
    value: number
    cssTransform: string
}

export type BarType = {
    cssTransform: string
}

export type BarProps = {
    barIndex: number
    cssTransform: string
}

export type ThumbProps = {
    trackElement: HTMLDivElement | null
    value: number
    tip?: boolean
    cssTransform: string
    zIndex: number
    thumbIndex: number
    isVertical?: boolean
    onMove: (thumbIndex: number, position: number) => void
}

export type ScaleProps = {
    stepInPercent: number
    isVertical?: boolean
    min: number
    max: number
    onMarkerCkick: (markerValue: number) => void
}

export type ScaleMarkerType = {
    value: number
    style: CSSProperties
}

export type ScaleMarkerProps = {
    value: number
    style: CSSProperties
    onClick: (markerValue: number) => void
}