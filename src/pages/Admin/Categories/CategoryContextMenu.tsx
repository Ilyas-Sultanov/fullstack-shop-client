import './CategoriesContextMenu.scss';
import Button from '../../../components/UI/Button/Button';

type CategoriesContextMenuProps = {
    coordinats: {x: number, y: number}
    nodeId: string
    actionButtons: {label: string | JSX.Element, func: (nodeId: string) => void}[];
    children?: never
}

function CategoriesContextMenu({coordinats, nodeId, actionButtons}: CategoriesContextMenuProps) {
    const css: React.CSSProperties = {
        display: 'flex',
        position: 'absolute',
        top: coordinats.y,
        left: coordinats.x,
    }

    return (
        <div className="categories__context-menu" style={css}>
            <div className="list-group">
                {
                    actionButtons.map((item, index) => {
                        

                        return (
                            <Button 
                                key={index} 
                                className="list-group-item list-group-item-action"
                                onClick={() => item.func(nodeId)}
                            >
                                {item.label}
                            </Button>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default CategoriesContextMenu;