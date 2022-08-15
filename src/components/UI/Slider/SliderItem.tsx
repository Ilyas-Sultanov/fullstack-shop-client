import { CSSProperties, ReactElement } from "react";

export type SliderItemType = ReactElement;

export type SliderItemProps = {
  style: CSSProperties
  children: SliderItemType
};

function SliderItem({style, children}: SliderItemProps) {
  
  return (
    <li 
      className="slider-item"
      style={style}
    >
        {children}
    </li>
  );
}

export default SliderItem;




// export type SliderItemType = {
//     imageSrc: string;
//     imageAlt: string;
// }

// export type SliderItemProps = SliderItemType;

// function SliderItem({ imageSrc, imageAlt }: SliderItemProps) {
//   return (
//     <li className="slider-item">
//         <img
//             src={imageSrc}
//             alt={imageAlt}
//             className="slider-img"
//             draggable={false}
//         />
//     </li>
//   );
// }

// export default SliderItem;