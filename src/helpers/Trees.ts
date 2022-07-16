interface ITreeDataEl {
    _id: string
    name: string
    parentId?: string
}

export interface ITree {
    _id: string
    name: string
    children: ITree[]
}

class Trees {
    trees: ITree[] = []

    constructor(data: ITreeDataEl[], parentId?: string) {
        this.trees = Trees.createTrees(data, parentId);
    }

    private static createTrees(data: ITreeDataEl[], parentId?: string) {
        let d: ITreeDataEl[] = []; 
        const trees: ITree[] = [];
        if (!parentId) {
            d = data.filter((item) => {
                return item.parentId === undefined;
            });
        }
        else {
            d = data.filter((item) => {
                return item.parentId?.toString() === parentId.toString(); 
            });
        }
        for (let i=0; i<d.length; i+=1) {
            const tree = {...d[i], children: Trees.createTrees(data, d[i]._id)};
            delete tree.parentId;
            trees.push(tree);
        }
        return trees;
    }
    
    private static __findTree(_id: string, tree: ITree): ITree | null {
        if (tree._id.toString() === _id) { // toString() обязательно т.к. _id имеет тип ObjectId
            return tree;
        }
        else if (tree.children && tree.children.length > 0) {
            let result = null;
            for (let i=0; i < tree.children.length; i+=1) {
                result = Trees.findTree(_id, tree.children);
            }
            return result;
        }
        return null;
    }

    public static findTree(_id: string, trees: ITree[]) {
        let tree: ITree | null = null;
        for (let i=0; i<trees.length; i+=1) {
            tree = Trees.__findTree(_id, trees[i]);
            if (tree) {
                break;
            }
        }
        return tree;
    }

    public static getFieldValues(tree: ITree, fieldName: '_id' | 'name') {
        let values: string[] = [];
        
        if (fieldName === '_id' || fieldName === 'name') {
            getValues(tree, fieldName);
        }

        function getValues(tree: ITree, fieldName: '_id' | 'name') {
            values.push(tree[fieldName]);
            if (tree.children && tree.children.length > 0) {
                for (let i=0; i < tree.children.length; i+=1) {
                    getValues(tree.children[i], fieldName);
                }
            }
        }

        return values;
    }
}

export default Trees;