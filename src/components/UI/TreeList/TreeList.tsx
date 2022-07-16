import './TreeList.scss';
import { MouseEvent, memo } from "react";
import TreeNode from './TreeNode';

export type TreeDataElement = {
    _id: string
    name: string
    checkbox?: boolean
    checked?: boolean
    children?: TreeDataElement[]
};

export type TreeActionButton = {label: string | JSX.Element, func: (nodeId: string) => void};

type TreeListProps = {
    data: TreeDataElement[]
    idOfCheckedNode?: string | null
    children?: never
    onCheck?: (node : TreeDataElement) => void
    onContextMenu?: (e: MouseEvent<HTMLDivElement>, nodeId: string) => void
}

function TreeList({data, idOfCheckedNode, onCheck, onContextMenu}: TreeListProps) {
    return (
        <div className="tree">
            <ul className="tree__list">
                {
                    data.map((element) => {                        
                        return (
                            <TreeNode 
                                key={element._id} 
                                node={element} 
                                checked={element._id === idOfCheckedNode}
                                idOfCheckedNode={idOfCheckedNode}
                                onCheck={onCheck}
                                onContextMenu={onContextMenu}
                            />
                        )
                    })
                }
            </ul>
        </div>
    );
};
    
export default memo(TreeList);
















// import './TreeList.scss';
// import { ChangeEvent, useState, MouseEvent } from "react";
// import { ReactComponent as ChevronIcon } from '../../../img/caret-right-fill.svg';
// import {ReactComponent as PlusIcon} from '../../../img/plus-square.svg';
// import {ReactComponent as EditIcon} from '../../../img/pencil-square.svg';
// import {ReactComponent as DeleteIcon} from '../../../img/dash-square.svg';
// import Button from '../Button/Button';

// type TreeDataElement = {
//     _id: string
//     name: string
//     children?: TreeDataElement[]
// };

// type TreeListProps = {
//     data: TreeDataElement[]
//     checkboxes: boolean
//     idsOfChecked: string[]
//     children?: never
//     onCheck?: (e: ChangeEvent<HTMLInputElement>) => void
//     onContextMenu?: (e: MouseEvent<HTMLDivElement>) => void
// }

// type TreeNodeProps = {
//     node: TreeDataElement
//     checkbox: boolean
//     idsOfChecked: string[]
//     children?: never
//     onCheck?: (e: ChangeEvent<HTMLInputElement>) => void
//     onContextMenu?: (e: MouseEvent<HTMLDivElement>) => void
// }

// function TreeList({data, checkboxes, idsOfChecked, onCheck, onContextMenu}: TreeListProps){
//     return (
//         <div className="tree">
//             <ul className="tree__container">
//                 {data.map((element) => (
//                     <TreeNode 
//                         key={element._id} 
//                         node={element} 
//                         checkbox={checkboxes} 
//                         idsOfChecked={idsOfChecked} 
//                         onCheck={onCheck}
//                         onContextMenu={onContextMenu}
//                     />
//                 ))}
//             </ul>
          
//         </div>
//     );
// };
  
// function TreeNode({node, checkbox, idsOfChecked, onCheck, onContextMenu}: TreeNodeProps) {
//     const [childVisible, setChildVisiblity] = useState(false);

//     function toggleShow() {
//         setChildVisiblity((prev) => !prev);
//     }
      
//     return (
//         <li className="tree__node node">
//             <div className="node__container mb-0">
//                 <div className={`node__actions ${childVisible ? "active" : ""}`}>
//                     { node.children?.length ? <ChevronIcon onClick={toggleShow}/> : '' }
//                     { checkbox ? <input className='node__checkbox' type="checkbox" value={node._id} checked={idsOfChecked.includes(node._id)} onChange={onCheck}/> : '' }
//                 </div> 
//                 <div 
//                     className="node__name d-flex" 
//                     style={checkbox ? {paddingLeft:'45px'} : {paddingLeft:'20px'}} 
//                     onContextMenu={onContextMenu}
//                 >
//                     <div className='me-2' onClick={(e) => setChildVisiblity((v) => !v)}>{node.name}</div>
//                     <div className='d-flex align-items-center'>
//                         <Button className='p-0 d-flex me-2'><PlusIcon/></Button>
//                         <Button className='p-0 d-flex me-2'><DeleteIcon/></Button>
//                         <Button className='p-0 d-flex'><EditIcon/></Button>
//                     </div>
//                 </div>
//             </div>
    
//             {
//                 node.children && childVisible && (
//                     <div className="tree__content">
//                         <ul className="tree__container">
//                             <TreeList data={node.children!} checkboxes={checkbox} idsOfChecked={idsOfChecked} onCheck={onCheck} onContextMenu={onContextMenu}/>
//                         </ul>
//                     </div>
//                 )
//             }
//         </li>
//     );
// };
  
// export default TreeList;