import {ChangeEvent, Fragment, useCallback} from 'react';
import Button from "../../../components/UI/Button/Button";
import Input from "../../../components/UI/Input/Input";
import Card from "../../../components/UI/Card/Card";
import {IUIFilterChoice, PropertyInputSettingsType} from '../../../types/CategoryTypes';
// import useWhyDidYouUpdate from '../../../hooks/useWhyDidYouUpdate';

type FilterChoiceProps = {
    choice: IUIFilterChoice
    choiceIndex: number
    propInputSettings: PropertyInputSettingsType
    onChangeChoice: (choice: IUIFilterChoice, choiceIndex: number) => void
    onDeleteChoice: (choiceIndex: number) => void
    children?: never
}

function CategoryPropertyFilterChoice({choice, choiceIndex, propInputSettings, onChangeChoice, onDeleteChoice}: FilterChoiceProps) {

    // useWhyDidYouUpdate('CategoryPropertyFilterChoice', {choice, choiceIndex, propInputSettings, onChangeChoice, onDeleteChoice});

    // const memoizedChoice: IUIFilterChoice = useMemo(() => {
    //     return JSON.parse(choice);
    // }, [choice]);

    // const memoizedPropInputSettings: PropertyInputSettingsType = useMemo(() => {
    //     return JSON.parse(propInputSettings);
    // }, [propInputSettings]);


    const choiceNameHandler = useCallback(
        function(name: string) {
            const ch = {...choice};
            ch.name = name;
            if (ch.validationObj.name) {
                delete ch.validationObj.name;
            }
            onChangeChoice(ch, choiceIndex);
        },
        [choice, choiceIndex, onChangeChoice]
    );
    

    const validateName = useCallback(
        function() {
            const ch = {...choice};
            if (!ch.name) {
                ch.validationObj.name = ['Required'];
            }
            if (ch.name.length < 1 || ch.name.length > 75) {
                const msg = 'Name length must be between 1 and 75 characters';
                if (!ch.validationObj.name) ch.validationObj.name = [msg];
                else ch.validationObj.name.push(msg);
            }
            onChangeChoice(ch, choiceIndex);
        },
        [choice, choiceIndex, onChangeChoice]
    );
    
    const choiceRangeValueHandler = useCallback(
        function(inputName: 'From' | 'To', value: string) {
            console.log(value);
            
            const ch = {...choice};
            if (inputName === 'From') {
                if (!ch.value) ch.value = [+value, null];
                else (ch.value as [number | null, number | null])[0] = value !== '' ? +value : null;
            }
            else if (inputName === 'To') {
                if (!ch.value) ch.value = [null, +value];
                else (ch.value as [number | null, number | null])[1] = value !== '' ? +value : null;
            }
            onChangeChoice(ch, choiceIndex);
        },
        [choice, choiceIndex, onChangeChoice]
    );

    const choiceValueHandler = useCallback(
        function(e: ChangeEvent<HTMLInputElement>) {
            const inputType = e.target.type;
            const value = inputType === 'number' ? Number(e.target.value) : e.target.value;
            const ch = {...choice};

            if (ch.validationObj.value) {
                delete ch.validationObj.value;
            }
    
            if (!propInputSettings.isRange) {
                ch.value = value;
            }

            onChangeChoice(ch, choiceIndex);
        },
        [choice, choiceIndex, propInputSettings.isRange, onChangeChoice]
    );
   

    const validateValue = useCallback(
        function() {
            const ch = {...choice};
            if (
                propInputSettings.isRange && 
                (ch.value as [number, number])[0] !== 0 &&
                (ch.value as [number, number])[1] !== 0 &&
                (!(ch.value as [number, number])[0] && !(ch.value as [number, number])[1])
            ) {
                // ch.validationObj.value = ['At least one of these fields must be filled'];
            }
            else if (!ch.value) {
                ch.validationObj.value = ['Required'];
            }
    
            if (
                propInputSettings.inputType === 'String' && 
                ((ch.value as string).length < 1 || (ch.value as string).length > 75)
            ) {
                const msg = 'Value length must be between 1 and 75 characters';
                if (!ch.validationObj.value) ch.validationObj.value = [msg];
                else ch.validationObj.value.push(msg);
            }
    
            if (
                propInputSettings.inputType === 'Number' && 
                (ch.value < 0 || ch.value > 999999)
            ) {
                const msg = 'The value cannot be less then 0 or greater than 999999';
                if (!ch.validationObj.value) ch.validationObj.value = [msg];
                else ch.validationObj.value.push(msg);
            }
    
            if (
                propInputSettings.isRange && 
                ( 
                    (
                        ((ch.value as [number, number])[0] && ((ch.value as [number, number])[0]) > 999999) ||
                        ((ch.value as [number, number])[0] && ((ch.value as [number, number])[0] as number) < 0)
                    ) ||
                    (
                        ((ch.value as [number, number])[1] && ((ch.value as [number, number])[1] as number) > 999999) ||
                        ((ch.value as [number, number])[1] && ((ch.value as [number, number])[1] as number) < 0)
                    )
                )
            ) {
                const msg = 'The numeric value of the ch value must be between 0 - 999999';
                ch.validationObj.value = [msg];
            }
            onChangeChoice(ch, choiceIndex);
        },
        [choice, choiceIndex, propInputSettings.inputType, propInputSettings.isRange, onChangeChoice]
    );
    

    const deleteChoice = useCallback(
        function() {
            onDeleteChoice(choiceIndex);
        },
        [choiceIndex, onDeleteChoice]
    );
   
    
    
    return (
        <Card className='choice mb-2'>
            <div className='mb-2'>
                <Input 
                    type='text'
                    name="" 
                    label='Name' 
                    value={choice.name} 
                    onChange={(e) => choiceNameHandler(e.target.value.trim())}
                    onBlur={validateName}
                    messages={choice.validationObj.name}
                />
            </div>
            {
                (propInputSettings.inputType === 'Number' && propInputSettings.isRange) ?
                <Fragment>
                    <div className='mb-2'>
                        <Input 
                            type='number'
                            name="From" 
                            label='Form' 
                            value={((choice.value as [number | null, number | null]) && (choice.value as [number | null, number | null])[0]) ? (choice.value as [number | null, number | null])[0]?.toString() : ''} 
                            onChange={(e) => choiceRangeValueHandler('From', e.target.value.trim())} 
                            onBlur={validateValue}
                            messages={choice.validationObj.value}
                        />
                    </div>
                    <div className='mb-2'>
                        <Input 
                            type='number'
                            name="To" 
                            label='To' 
                            value={((choice.value as [number | null, number | null]) && (choice.value as [number | null, number | null])[1]) ? (choice.value as [number | null, number | null])[1]?.toString() : ''} 
                            onChange={(e) => choiceRangeValueHandler('To', e.target.value.trim())} 
                            onBlur={validateValue}
                            messages={choice.validationObj.value}
                        />
                    </div>
                </Fragment> :
                <div className='mb-2'>
                    <Input 
                        type={propInputSettings.inputType === 'Number' ? 'number' : 'text'}
                        name="Equal" 
                        label='Value' 
                        value={choice.value ? choice.value.toString() : ''} 
                        // onChange={(e) => choiceValueHandler('Equal', e.target.value.trim())} 
                        onChange={choiceValueHandler} 
                        onBlur={validateValue}
                        messages={choice.validationObj.value}
                    />
                </div>
            }
            <Button className='text-nowrap btn-sm btn-danger' onClick={deleteChoice}>Delete choice</Button>
        </Card>
    )
}

export default CategoryPropertyFilterChoice;