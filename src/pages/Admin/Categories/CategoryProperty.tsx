import {useState, useMemo, useCallback, ChangeEvent} from 'react';
import Button from "../../../components/UI/Button/Button";
import Input from "../../../components/UI/Input/Input";
import Card from "../../../components/UI/Card/Card";
import CheckboxRadio from "../../../components/UI/Checkbox-Radio/CheckboxRadio";
import { ReactComponent as HideIcon } from '../../../img/chevron-down.svg';
import { IUIProperty, IUIFilterChoice } from '../../../types/CategoryTypes';
import CategoryPropertyFilterChoice from './CategoryPropertyFilterChoice';
import {v4} from 'uuid';
import { Fragment } from "react";
// import useWhyDidYouUpdate from '../../../hooks/useWhyDidYouUpdate';

type CategoryPropertyProps = {
    property: IUIProperty
    // property: string
    propIndex: number
    onChangeProperty: (chengedProperty: IUIProperty, propIndex: number) => void
    onDeleteProperty: (propIndex: number) => void
    children?: never
}

function CategoryProperty({property, propIndex, onChangeProperty, onDeleteProperty}: CategoryPropertyProps) {
    const [show, setShow] = useState(false);

    // useWhyDidYouUpdate('CategoryProperty', {property, propIndex, onChangeProperty, onDeleteProperty, show});

    // const memoizedProperty: IUIProperty = useMemo(() => {
    //     return JSON.parse(memoizedProperty);
    // }, [memoizedProperty]);


    const isValid = useMemo(() => { 
        let result = true;
        if (
            property.validationObj.filterable || 
            property.validationObj.name || 
            property.validationObj.unit
        ) {
            result = false;
        }

        if (property.filterChoices) {
            for (let i=0; i<property.filterChoices.length; i+=1) {
                if (Object.keys(property.filterChoices[i].validationObj).length > 0) {
                    result = false;
                    break;
                }
            }
        }       

        return result;
    }, [property]);

    

    const propNameHandler = useCallback(
        function(e: ChangeEvent<HTMLInputElement>) {
            const prop = {...property};
            prop.name = e.target.value;
            if (prop.validationObj.name) {
                delete prop.validationObj.name;
            }
            onChangeProperty(prop, propIndex);
        },
        [property, propIndex, onChangeProperty]
    );

        
    const validateName = useCallback(
        function() {
            const prop = {...property};
            if (!prop.name) {
                prop.validationObj.name = ['Required'];
            }
            if (prop.name.length < 1 || prop.name.length > 75) {
                const msg = 'Name length must be between 1 and 75 characters';
                if (!prop.validationObj.name) prop.validationObj.name = [msg];
                else prop.validationObj.name.push(msg);
            }
            onChangeProperty(prop, propIndex);
        },
        [property, propIndex, onChangeProperty]
    );


    const isRequiredHandler = useCallback(
        function() {
            const prop = {...property};
            prop.required = !prop.required;
            onChangeProperty(prop, propIndex);
        },
        [property, propIndex, onChangeProperty]
    );
   

    const isFilterableHandler = useCallback(
        function() {
            const prop = {...property};
            prop.filterable = !prop.filterable;
            if (prop.validationObj.filterable) {
                delete prop.validationObj.filterable;
            }
            if (prop.filterable && prop.inputSettings.inputType !== 'Boolean' && prop.filterChoices!.length < 1) { // validation
                prop.validationObj.filterable = ['For a filterable property, you must specify at least one filter option'];
            }
            if (prop.filterable && prop.inputSettings.inputType === 'Boolean' && (!prop.filterChoices || prop.filterChoices.length !== 2)) {
                prop.filterChoices = [
                    {name: 'Да', value: true, validationObj: {}, key: v4()},
                    {name: 'Нет', value: false, validationObj: {}, key: v4()}
                ]
            }
            onChangeProperty(prop, propIndex);
        },
        [property, propIndex, onChangeProperty]
    );
    

    const addFilterChoices = useCallback(
        function() {
            const prop = {...property};
            if (!prop.filterChoices) prop.filterChoices = [];
            const emptyChoice: IUIFilterChoice = {
                key: v4(),
                name: '',
                value: property.inputSettings.isRange ? [null, null] : '',
                validationObj: {
                    name: ['Required'],
                    // value: isRange ? ['At least one of these fields must be filled'] : ['Required'],
                }
            }
            
            prop.filterChoices.unshift(emptyChoice);
            delete prop.validationObj.filterable;
            onChangeProperty(prop, propIndex);
        },
        [property, /*isRange,*/ propIndex, onChangeProperty]
    );
    

    const inputTypeHandler = useCallback(
        function(inputType: 'String' | 'Number' | 'Boolean') {
            const prop = {...property};
            prop.inputSettings.inputType = inputType;
            prop.filterChoices = []; // При смене настроек инпута, удаляем все choices
            if (prop.validationObj.unit) {
                delete prop.validationObj.unit;
            }
            if (prop.inputSettings.inputType === 'Number' && !prop.unit) { // validation
                prop.validationObj.unit = ['For an input of type Number, you need to specify the unit of measurement'];
            }
            if (prop.inputSettings.inputType === 'Boolean' && prop.filterable) {
                prop.filterChoices = [
                    {name: 'Да', value: true, validationObj: {}, key: v4()},
                    {name: 'Нет', value: false, validationObj: {}, key: v4()}
                ]
            }
            onChangeProperty(prop, propIndex);
        },
        [property, propIndex, onChangeProperty]
    );
    

    const inputInDetailsHandler = useCallback(
        function (detail: 'Multiselect' | 'OneSelect' | 'Range') {
            const prop = {...property};
            prop.filterChoices = []; // При смене настроек инпута, удаляем все choices
    
            if (detail === 'Multiselect') {
                prop.inputSettings.isMultiselect = !prop.inputSettings.isMultiselect;
                prop.inputSettings.isRange = false;
                // if (property.inputSettings.isRange) setIsRange(false);
                if (property.inputSettings.isRange) prop.inputSettings.isRange = false;
            }
            else if (detail === 'OneSelect') {
                prop.inputSettings.isMultiselect = false;
                prop.inputSettings.isRange = false;
                // if (property.inputSettings.isRange)  setIsRange(false);
                if (property.inputSettings.isRange) prop.inputSettings.isRange = false;
            }
            else {
                prop.inputSettings.isRange = !prop.inputSettings.isRange;
                prop.inputSettings.isMultiselect = false;
                // setIsRange(true);
                if (!property.inputSettings.isRange) prop.inputSettings.isRange = true;
            }
            onChangeProperty(prop, propIndex);
        },
        [property, /*isRange,*/ propIndex, onChangeProperty]
    );
    

    const unitHandler = useCallback(
        function(propIndex: number, unitName: string) {
            const prop = {...property};
            prop.unit = unitName;
            delete prop.validationObj.unit;
            onChangeProperty(prop, propIndex);
        },
        [property, onChangeProperty]
    );
  

    const validateUnit = useCallback(
        function() {
            const prop = {...property};
            if (prop.unit && prop.unit.length > 10) {
                const msg = 'Unit name cannot be longer than 10 characters';
                if (!prop.validationObj.unit) prop.validationObj.unit = [msg];
                else prop.validationObj.unit.push(msg);
            }
            onChangeProperty(prop, propIndex);
        },
        [property, propIndex, onChangeProperty]
    );
    

    const deletePropHandler = useCallback(
        function deletePropHandler() {
            onDeleteProperty(propIndex);
        },
        [propIndex, onDeleteProperty]
    );
  


    /**
     * При изменении filterChoices, меняется весь property и соответственно property,
     * поэтому нет смысла помещать onChangeChoice и onDeleteChoice в useCallback, ведь
     * в зависимостях будет property.
     */

    
    function onChangeChoice(choice: IUIFilterChoice, choiceIndex: number) {
        const prop = {...property};
        prop.filterChoices![choiceIndex] = choice;
        onChangeProperty(prop, propIndex);
    }
  
    
    function onDeleteChoice (choiceIndex: number) {
        const prop = {...property};
        prop.filterChoices!.splice(choiceIndex, 1);
        onChangeProperty(prop, propIndex);
    }

    
    const toggleShowProp = useCallback(
        function() {
            setShow((prev) => {
                return !prev;
            });
        },
        []
    );
 

    return (
        <Card className={`create-properties__prop mb-2 ${show ? 'show' : ''} ${!isValid ? 'invalid' : ''}`}>
            <HideIcon className="create-properties__hide-icon" onClick={toggleShowProp}/>

            <div className="mb-2">
                <Input 
                    name="" 
                    label="Property name" 
                    value={property.name} 
                    // onChange={(e) => propNameHandler(e.target.value.trim())}
                    onChange={propNameHandler}
                    onBlur={validateName}
                    messages={property.validationObj.name}
                />
            </div>

            <div className='create-properties__content'>
                
                <div className='create-category__checkboxes'>
                    <CheckboxRadio 
                        type='checkbox' 
                        name={`${property.key} Required`} 
                        label='Required' 
                        checked={property.required ? true : false} 
                        onChange={isRequiredHandler}
                    />
                    <CheckboxRadio 
                        type='checkbox' 
                        name={`${property.key} Filterable`} 
                        label='Filterable' 
                        checked={property.filterable ? true : false} 
                        onChange={isFilterableHandler} 
                        className='mb-2'
                    />
                </div>

                <Card className='mb-2 create-properties__input-settings'>
                    <span className='d-block mb-2 title'>Input settings</span>
                    <Card className='checkboxes mb-2'>
                        <CheckboxRadio type='radio' 
                            name={`${property.key} inputType`} 
                            label='String' 
                            value='String' 
                            checked={property.inputSettings.inputType === 'String'} 
                            onChange={(e) => inputTypeHandler('String')}
                        />
                        <CheckboxRadio type='radio' 
                            name={`${property.key} inputType`} 
                            label='Number'
                            value='Number' 
                            checked={property.inputSettings.inputType === 'Number'} 
                            onChange={(e) => inputTypeHandler('Number')}
                        />
                        <CheckboxRadio type='radio' 
                            name={`${property.key} inputType`} 
                            label='Boolean' 
                            value='Boolean' 
                            checked={property.inputSettings.inputType === 'Boolean'} 
                            onChange={(e) => inputTypeHandler('Boolean')}
                        />
                    </Card>
                    {
                        property.inputSettings.inputType !== 'Boolean' ?
                        <Card className='inputInDetails'>
                            <CheckboxRadio 
                                type='radio'
                                name={`${property.key} Detail`} 
                                label='OneSelect' 
                                checked={!property.inputSettings.isMultiselect && !property.inputSettings.isRange} 
                                onChange={(e) => inputInDetailsHandler('OneSelect')}
                            />
                            <CheckboxRadio 
                                type='radio'
                                name={`${property.key} Detail`} 
                                label='Multiselect' 
                                checked={property.inputSettings.isMultiselect} 
                                onChange={(e) => inputInDetailsHandler('Multiselect')}
                            />
                            {
                                property.inputSettings.inputType === 'Number' ?
                                <CheckboxRadio 
                                    type='radio' 
                                    name={`${property.key} Detail`} 
                                    label='Range' 
                                    checked={property.inputSettings.isRange} 
                                    onChange={(e) => inputInDetailsHandler('Range')}
                                /> : 
                                null
                            }
                        </Card> :
                        null
                    }
                </Card>

                {
                    property.inputSettings.inputType === 'Number' ? 
                    <div className="mb-2">
                        <Input 
                            name={`${property.key} unitName`} 
                            label='Unit' 
                            value={property.unit} 
                            onChange={(e) => unitHandler(propIndex, e.target.value.trim())}
                            onBlur={validateUnit}
                            messages={property.validationObj.unit}
                        /> 
                    </div> : ''
                }

                {
                    property.inputSettings.inputType !== 'Boolean' && 
                    <Fragment>
                        {
                            property.filterable ? 
                            <Card className='mb-2'>
                                {
                                    property.validationObj.filterable ? 
                                    property.validationObj.filterable.map((msg, index) => {
                                        return <div className='invalid-feedback d-block mb-2 mt-0' key={index}>{msg}</div>
                                    }) :
                                    ''
                                }
                                <Button className="btn-sm btn-secondary mb-2" onClick={addFilterChoices}>Add filter choice</Button>
                                {
                                    property.filterChoices && property.filterChoices.length > 0 ? 
                                    property.filterChoices.map((choice, idx) => {
                                        return (
                                            <CategoryPropertyFilterChoice
                                                key={choice.key}
                                                // choice={JSON.stringify(choice)}
                                                choice={choice}
                                                choiceIndex={idx}
                                                // propInputSettings={JSON.stringify(property.inputSettings)}
                                                propInputSettings={property.inputSettings}
                                                onChangeChoice={onChangeChoice}
                                                onDeleteChoice={onDeleteChoice}
                                            />
                                        )
                                    }) : 
                                    ''
                                }
                            </Card> : 
                            ''
                        }
                    </Fragment>
                }   

            </div>         
            <Button className="create-properties__delete-btn btn-sm btn-danger" onClick={deletePropHandler}>Delete property</Button>
        </Card>
    )
}

export default CategoryProperty;