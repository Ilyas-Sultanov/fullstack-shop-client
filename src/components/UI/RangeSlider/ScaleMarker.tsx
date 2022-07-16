import { ScaleMarkerProps } from "./types";

function ScaleMarker({value, style, onClick}: ScaleMarkerProps) {
    return (
        <div className="scale__marker" style={style}>
            <div className="scale__number" onClick={() => onClick(value)}>
                {value}
            </div>
        </div>
    )
}

export default ScaleMarker;