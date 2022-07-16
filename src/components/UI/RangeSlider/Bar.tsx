import { BarProps } from "./types";

/**
 * Bar это div, позиция которого привязана к началу трека если кнопка одна
 * и этот div растягивается (при помощи css свойства transform: scale()) до положения кнопки.
 * Если кнопок больше, то позиция привязана к кнопке, а растягивается бар до позиции ближайшей справа кнопки если слайдер горизонтальный
 * или до ближайшей сверху кнопки, если слайдер вертикальный.
 */

function Bar({barIndex, cssTransform}: BarProps) {
    return (
        <div 
            className={`bar bar-${barIndex}`}
            style={{
                transform: cssTransform, 
            }}
        />
    )
}

export default Bar;