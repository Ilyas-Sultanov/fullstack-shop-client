import { ReactNode, memo } from 'react';
import { FilterChoiceValue } from '../../../types/CategoryTypes';
import {IPreparedForUIProperty} from '../../../types/Products';
import Card from '../../../components/UI/Card/Card';
import CheckboxRadio from '../../../components/UI/Checkbox-Radio/CheckboxRadio';
import Input from '../../../components/UI/Input/Input';
// import useWhyDidYouUpdate from '../../../hooks/useWhyDidYouUpdate';

type ProductPropertyProps = {
    property: IPreparedForUIProperty
    onChangeProp: (categoryPropId: string, value: FilterChoiceValue) => void
    onChangeMultiselectProp: (categoryPropId: string, value: FilterChoiceValue) => void
}

function ProductProperty({property, onChangeProp, onChangeMultiselectProp}: ProductPropertyProps) {

    // useWhyDidYouUpdate('ProductProperty', {category, property, onChangeProp, onChangeMultiselectProp});
    const propertyLabel = `${property.name} (${property.unit})`;
    let Component: ReactNode = null;

    if (property.inputSettings.inputType === 'Number' || property.inputSettings.inputType === 'String') {
        if (property.filterable) {
            Component = <Card className='mb-2'>
                {
                    property.inputSettings.isRange ? 
                    <Input 
                        type='number'
                        name={property.name} 
                        label={propertyLabel} 
                        value={property.value.toString()}
                        className='mb-2' 
                        onChange={(e) => onChangeProp(property.categoryPropId, e.target.value ? Number(e.target.value) : '')}
                    /> :
                    <>  
                        <div>{propertyLabel}</div>
                        {
                            property.filterChoices && property.filterChoices.length > 0 ?
                            property.filterChoices.map((choice, index) => {
                                return (
                                    <CheckboxRadio 
                                        key={index} 
                                        type={property.inputSettings.isMultiselect ? 'checkbox' : 'radio'}
                                        name={property.inputSettings.isMultiselect ? '' : property.name} 
                                        label={choice.name} 
                                        value={JSON.stringify(choice.value)}
                                        checked={
                                            property.inputSettings.isMultiselect ? 
                                            (property.value as string[]).includes(choice.value as string) : 
                                            choice.value === property.value
                                        }
                                        onChange={(e) => {
                                            if (property.inputSettings.isMultiselect) onChangeMultiselectProp(property.categoryPropId, JSON.parse(e.target.value));
                                            else onChangeProp(property.categoryPropId, JSON.parse(e.target.value));
                                        }}
                                    />
                                )
                            }) : null
                        }
                    </>
                }
                {
                    property.validationMessages.length > 0 ?
                    property.validationMessages.map((msg, index) => {
                        return (
                            <div key={index} className='invalid-feedback d-block'>
                                <span>{msg}</span>
                            </div>
                        )
                    }): null
                }
            </Card>
        }
        else {
            Component = <Input 
                type={property.inputSettings.inputType === 'Number' ? 'number' : 'text'} 
                name={property.name} 
                label={propertyLabel} 
                value={property.value.toString()}
                className='mb-2' 
                onChange={(e) => {
                    onChangeProp(property.categoryPropId, property.inputSettings.inputType === 'Number' ? Number(e.target.value) : e.target.value)}
                }
            />
        }
    }
    else if (property.inputSettings.inputType === 'Boolean') { // boolean не фильтруемый всегда
        Component = <Card className='mb-2'>
            <div>{propertyLabel}</div>
            <div>
                <CheckboxRadio 
                    type='radio' 
                    name={property.name} 
                    label='Yes'
                    value={JSON.stringify(true)}
                    checked={property.value === true}
                    onChange={(e) => onChangeProp(property.categoryPropId, JSON.parse(e.target.value))}
                />
                <CheckboxRadio 
                    type='radio' 
                    name={property.name} 
                    label='No' 
                    value={JSON.stringify(false)}
                    checked={property.value === false || property.value === ''}
                    onChange={(e) => onChangeProp(property.categoryPropId, JSON.parse(e.target.value))}
                />
            </div>
        </Card>
    }

    return (
        Component
    )
}

export default memo(ProductProperty);





// import { ReactNode, useMemo, memo } from 'react';
// import { FilterChoiceValue } from '../../../types/CategoryTypes';
// import {IUIProductProperty, IPreparedForUIProperty} from '../../../types/Products';
// import Card from '../../../components/UI/Card/Card';
// import CheckboxRadio from '../../../components/UI/Checkbox-Radio/CheckboxRadio';
// import Input from '../../../components/UI/Input/Input';
// import { IDBCategory } from '../../../types/CategoryTypes';
// // import useWhyDidYouUpdate from '../../../hooks/useWhyDidYouUpdate';

// type ProductPropertyProps = {
//     category: IDBCategory
//     // property: IUIProductProperty
//     property: IPreparedForUIProperty
//     onChangeProp: (categoryPropId: string, value: FilterChoiceValue) => void
//     onChangeMultiselectProp: (categoryPropId: string, value: FilterChoiceValue) => void
// }

// function ProductProperty({category, property, onChangeProp, onChangeMultiselectProp}: ProductPropertyProps) {

//     // useWhyDidYouUpdate('ProductProperty', {category, property, onChangeProp, onChangeMultiselectProp});

//     const isRangeProp = useMemo(
//         function() {
//             if (category.properties) {
//                 const catProp = category.properties.find((prop) => prop._id === property.categoryPropId);
//                 if (catProp?.inputSettings.isRange) return true;
//             }
//             return false;
//         },
//         [category, property.categoryPropId]
//     );

//     const unit = useMemo(
//         function() {
//             if (category.properties) {
//                 const catProp = category.properties.find((prop) => prop._id === property.categoryPropId);
//                 return catProp?.unit
//             }
//             return false;
//         },
//         [category, property.categoryPropId]
//     );

//     const propertyLabel = unit ? `${property.name} (${unit})` : `${property.name}`;
//     let Component: ReactNode = null;

//     if (property.inputSettings.inputType === 'Number' || property.inputSettings.inputType === 'String') {
//         if (property.filterable) {
//             Component = <Card className='mb-2'>
//                 {
//                     isRangeProp ? 
//                     <Input 
//                         type='number'
//                         name={property.name} 
//                         label={propertyLabel} 
//                         value={property.value.toString()}
//                         className='mb-2' 
//                         onChange={(e) => onChangeProp(property.categoryPropId, e.target.value ? Number(e.target.value) : '')}
//                     /> :
//                     <>  
//                         <div>{propertyLabel}</div>
//                         {
//                             property.filterChoices && property.filterChoices.length > 0 ?
//                             property.filterChoices.map((choice, index) => {
//                                 return (
//                                     <CheckboxRadio 
//                                         key={index} 
//                                         type={property.inputSettings.isMultiselect ? 'checkbox' : 'radio'}
//                                         name={property.inputSettings.isMultiselect ? '' : property.name} 
//                                         label={choice.name} 
//                                         value={JSON.stringify(choice.value)}
//                                         checked={
//                                             property.inputSettings.isMultiselect ? 
//                                             (property.value as string[]).includes(choice.value as string) : 
//                                             choice.value === property.value
//                                         }
//                                         onChange={(e) => {
//                                             if (property.inputSettings.isMultiselect) onChangeMultiselectProp(property.categoryPropId, JSON.parse(e.target.value));
//                                             else onChangeProp(property.categoryPropId, JSON.parse(e.target.value));
//                                         }}
//                                     />
//                                 )
//                             }) : null
//                         }
//                     </>
//                 }
//                 {
//                     property.validationMessages.length > 0 ?
//                     property.validationMessages.map((msg, index) => {
//                         return (
//                             <div key={index} className='invalid-feedback d-block'>
//                                 <span>{msg}</span>
//                             </div>
//                         )
//                     }): null
//                 }
//             </Card>
//         }
//         else {
//             Component = <Input 
//                 type={property.inputSettings.inputType=== 'Number' ? 'number' : 'text'} 
//                 name={property.name} 
//                 label={propertyLabel} 
//                 value={property.value.toString()}
//                 className='mb-2' 
//                 onChange={(e) => {
//                     onChangeProp(property.categoryPropId, property.inputSettings.inputType === 'Number' ? Number(e.target.value) : e.target.value)}
//                 }
//             />
//         }
//     }
//     else if (property.inputSettings.inputType === 'Boolean') { // boolean не фильтруемый всегда
//         Component = <Card className='mb-2'>
//             <div>{propertyLabel}</div>
//             <div>
//                 <CheckboxRadio 
//                     type='radio' 
//                     name={property.name} 
//                     label='Yes'
//                     value={JSON.stringify(true)}
//                     checked={property.value === true}
//                     onChange={(e) => onChangeProp(property.categoryPropId, JSON.parse(e.target.value))}
//                 />
//                 <CheckboxRadio 
//                     type='radio' 
//                     name={property.name} 
//                     label='No' 
//                     value={JSON.stringify(false)}
//                     checked={property.value === false || property.value === ''}
//                     onChange={(e) => onChangeProp(property.categoryPropId, JSON.parse(e.target.value))}
//                 />
//             </div>
//         </Card>
//     }

//     return (
//         Component
//     )
// }

// export default memo(ProductProperty);