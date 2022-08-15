import { FilterChoiceValue } from "../../types/CategoryTypes";
import { IPreparedForUIProperty } from "../../types/Products";

type ProductSpecificationsProps = {
    properties: Array<IPreparedForUIProperty>
}

function ProductSpecifications({properties}: ProductSpecificationsProps) {

    function getValue(value: FilterChoiceValue) {
        if (Array.isArray(value)) return value.join(', ');
        else if (typeof value !== 'boolean') return value;
        else if (value) return 'Да';
        return 'Нет';
    }

    return (
        <>
            <h4>Specifications:</h4>

            <div className="table-responsive">
                <table className="table table-striped table-bordered table-sm">
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            properties.map((prop, index) => {
                                return (
                                    <tr key={index}>
                                        <th>{prop.name}</th>
                                        <td>{getValue(prop.value)}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default ProductSpecifications;