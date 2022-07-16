import { MouseEvent, TouchEvent, FocusEvent } from 'react';
import { ThumbProps } from './types';

/**
 * Когда нажымаем на кнопку (ползунок) и ещё не отпустили, мы добавляем обработчик движения mouse/touch,
 * пока кнопка не отпущена и пользователь двигает мышь или палец по по экрану, мы двигаем кнопку, как только 
 * пользователь отпускает кнопку мы сразу удаляем обработчик движения mouse/touch, таким образом кнопка дальше не движется
 */

/**
 * Thumb это div занимающий ВСЮ длинну трека и имеющий нулевую высоту/ширину (т.е. не видим), 
 * его псевдоэлемент before авляется видимой кнопкой.
 * Перемещение кнопки достигается путем изменения css свойства transform: translate().
 * 
 * Такой способ передвижеия кнопки производительнее чем еслибы мы перемещали её при помощи свойств position.
 * Перемещение при помощи position просчитывается при помощи CPU,
 * а перемещение при помощи transform просчитывается при помощи GPU, отсюда и скорость.
 */

function Thumb({trackElement, value, tip, cssTransform, zIndex, thumbIndex, isVertical, onMove}: ThumbProps) {
    function bindListeners(e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) {
        const isMouse = e.type === 'mousedown' ? true : false; 
        // console.log(e.type); // 'mousedown' или 'touchstart'      
    
        if (isMouse) { // не получилось при помощи pointer events (делается только один шаг) !!!!!!!!!!!!
            document.onmouseup = () => {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        } 
        else {
            document.ontouchend = () => {
                document.ontouchmove = null;
                document.ontouchend = null;
            };
        }
        
        if (isMouse) document.onmousemove = moveByPointer;
        else document.ontouchmove = moveByPointer;
    }

    function bindKeyListeners(e: FocusEvent<HTMLDivElement>) {
        // console.log(e.type); // 'focus'  
        // e.key: ArrowRight
        e.target.onkeydown = moveBykeyboard;
        
    }

    function moveBykeyboard(e: KeyboardEvent) {
        const thumb = e.target as HTMLDivElement;
        let position = 0;

        if (e.key !== 'ArrowRight' && 
            e.key !== 'ArrowLeft' && 
            e.key !== 'ArrowUp' && 
            e.key !== 'ArrowDown'
        ) return;
        
        const translateX = (() => {
            const start = thumb.style.transform.indexOf('(') + 1;
            const end = thumb.style.transform.indexOf('%');
            return Number(thumb.style.transform.slice(start, end));
            /**
             * thumb имеет transform-origin: right center и width: 100% трека
             * поэтому translateX - это отрицательное значение
             */
        })();

        const translateY = (() => {
            const start = thumb.style.transform.indexOf(',') + 2;
            const end = thumb.style.transform.lastIndexOf('%');
            return Number(thumb.style.transform.slice(start, end));
            /**
             * thumb имеет transform-origin: center bottom и height: 100% трека
             * поэтому translateY - это отрицательное значение
             */
        })();
       
        if (isVertical && trackElement) {
            if (e.key === 'ArrowUp') position = Math.abs((translateY / 100)) + 0.01;
            if (e.key === 'ArrowDown') position = Math.abs((translateY / 100)) - 0.01;
            /**
             * position это десятичное число от 0 до 1, где 0 - 0%, а 1 - 100%. 
             * Т.е. положение кнопки внутри трека (относительно трека) в процентах.
             * 0.01 - это 1%
             */
        } 
        else if (trackElement) {
            if (e.key === 'ArrowRight') position = ((translateX + 100) / 100) + 0.01; 
            if (e.key === 'ArrowLeft') position = ((translateX + 100) / 100) - 0.01;
        }

        if (position < 0) position = 0;
        if (position > 1) position = 1;
        onMove(thumbIndex, position);
    }

    function moveByPointer(e: globalThis.MouseEvent | globalThis.TouchEvent) {
        /**
         * Положение кнопки расчитывается так:
         * При начале движения кнопки находится расстояние трека от края viewport в пикселях
         * (левого края если слайдер горизонтальный, от нижнего края если вертикальный).
         * Далее расчитывается положение курсора на странице с учетом прокрутки по оси X или Y (в пикселях).
         * Получив эти два значения, мы можем рсчитать смещение кнопки от носительно трека в пикселях,
         * прсто вычтем из положения курсора, расстояние трека от края viewport.
         * Далее расчитываем сколько процентов от ширины/высоты трека, занимает смещение кнопки,
         * просто разделив смещение кнопки в пикселях на ширину или высоту трека в пикселях,
         * так мы получем десятичное значение от 0 до 1, где 0 - 0%, а 1 - 100%.
         * Этот процент и будет новое положение кнопки.
         */
        let offsetInsideTrack: number;
        let position = 1; // position это десятичное число от 0 до 1, где 0 - 0%, а 1 - 100%. Т.е. положение кнопки внутри трека (относительно трека) в процентах. 
        const isMouse = e.type === 'mousemove' ? true : false;   
        // console.log(e.type); // 'mousemove' или 'touchmove'        
                   
        if (isVertical && trackElement) {
            const offsetFromViewportPx = trackElement.getBoundingClientRect().bottom + window.scrollY; // Отступ div элемента track от края viewport (в пикселях)
            const pageY = isMouse ? (e as globalThis.MouseEvent).pageY : (e as globalThis.TouchEvent).touches[0].pageY; // положение курсора на странице с учетом прокрутки по оси Y (в пикселях)
            offsetInsideTrack = pageY - offsetFromViewportPx; // Смещение кнопки относительно трека
            if (offsetInsideTrack > 0) offsetInsideTrack = 0; // Если смещение кнопки выходит за пределы трека со стороны начала трека, то возвращаем кнопку в начало трека
            else if (offsetInsideTrack > trackElement.offsetHeight) { // Если смещение кнопки выходит за пределы трека со стороны конца трека, то возвращаем кнопку в конец трека
                offsetInsideTrack = trackElement.offsetHeight;
            }
            position = Math.abs(offsetInsideTrack / trackElement.offsetHeight)
        } 
        else if (trackElement) {
            const pageX = isMouse ? (e as globalThis.MouseEvent).pageX : (e as globalThis.TouchEvent).touches[0].pageX;
            const offsetFromViewportPx = trackElement.getBoundingClientRect().left + window.scrollX;
            offsetInsideTrack = pageX - offsetFromViewportPx;
            position = offsetInsideTrack / trackElement.offsetWidth;
        }

        if (position > 1) position = 1;
        else if (position < 0) position = 0;
        
        onMove(thumbIndex, position)
    }


    return (
        <div 
            className={`thumb thumb-${thumbIndex}`}
            style={{zIndex: `${zIndex}`, transform: `${cssTransform}`}}
            onMouseDown={bindListeners}
            onTouchStart={bindListeners}
            onFocus={bindKeyListeners}
            onBlur={(e) => e.target.onfocus = null}
            tabIndex={0}
        >
            {
                tip ? 
                <div 
                    className="thumb__tip"
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                >
                    {value}
                </div> : 
                ''
            }            
        </div>
    )
}

export default Thumb;