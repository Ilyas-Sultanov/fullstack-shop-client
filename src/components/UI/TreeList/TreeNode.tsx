import {useState, MouseEvent, memo} from 'react';
import {ReactComponent as ChevronIcon} from '../../../img/caret-right-fill.svg';
import {ReactComponent as ContextMenuIcon} from '../../../img/three-dots.svg';
import TreeList, {TreeDataElement} from './TreeList';

type TreeNodeProps = {
    node: TreeDataElement
    children?: never
    checked?: boolean
    idOfCheckedNode?: string | null
    onCheck?: (node: TreeDataElement) => void
    onContextMenu?: (e: MouseEvent<HTMLDivElement>, nodeId: string) => void
}

function TreeNode({node, idOfCheckedNode, onCheck, checked, onContextMenu}: TreeNodeProps) {
    const [childVisible, setChildVisiblity] = useState(false);

    function toggleShow() {
        setChildVisiblity((prev) => !prev);
    }

    function clickHandler(e: MouseEvent<HTMLDivElement>, nodeId: string) {
        if (onContextMenu) {
            onContextMenu(e, nodeId)
        }
    }
      
    return (
        <li className="tree__node node">
            <div className="node__container mb-0">
                <div className={`node__left-actions ${childVisible ? "active" : ""}`}>
                    { node.children?.length ? <ChevronIcon onClick={toggleShow}/> : '' }
                    { 
                        node.checkbox ? 
                        <input 
                            className='node__checkbox' 
                            type="checkbox" 
                            value={node._id} 
                            data-name={node.name} 
                            checked={checked} 
                            onChange={onCheck ? () => onCheck(node) : () => {}}
                        /> : '' }
                </div> 
                <div 
                    className="node__name d-flex" 
                    style={onCheck ? {paddingLeft:'45px'} : {paddingLeft:'20px'}} 
                >
                    <div 
                        className='node__label me-2' 
                        onClick={toggleShow} 
                        onContextMenu={(e) => onContextMenu ? onContextMenu(e, node._id) : undefined}
                    >
                        {node.name}
                    </div>
                    { onContextMenu ? <div className='node__context-menu-icon' onClick={(e) => clickHandler(e, node._id)}><ContextMenuIcon/></div> : '' }
                </div>
            </div>
    
            {
                node.children && childVisible && (
                    <div className="tree__content">
                        <ul className="tree__list">
                            <TreeList 
                                // ВНИМАНИЕ, не забывай передавать все пропсы, ведь это рекурсивный компонент  
                                data={node.children!} 
                                onCheck={onCheck} 
                                idOfCheckedNode={idOfCheckedNode}
                                onContextMenu={onContextMenu ? onContextMenu : undefined} 
                            />
                        </ul>
                    </div>
                )
            }
        </li>
    );
};

export default memo(TreeNode);