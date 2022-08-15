import { ReactNode, useCallback, useMemo } from 'react';
import Button from '../../../components/UI/Button/Button';
import { ReactComponent as XIcon } from '../../../img/x-lg.svg';
import { ReactComponent as FilterIcon } from '../../../img/funnel.svg';
import Accordion from '../../../components/UI/Accordion/Accordion';
import AccordionItem from '../../../components/UI/Accordion/AccordionItem';
import { FilterChoiceValue, PropertyType } from '../../../types/CategoryTypes';
import RangeSlider from '../../../components/UI/RangeSlider/RangeSlider';
import CheckboxRadio from '../../../components/UI/Checkbox-Radio/CheckboxRadio';
import { DBBrand } from '../../../types/Brand';
import { RangeSliderValues } from '../../../components/UI/RangeSlider/types';
import useWhyDidYouUpdate from '../../../hooks/useWhyDidYouUpdate';

type FilterProps = {
    className: string
    highestPrice: number
    brands: Array<DBBrand>
    properties?: Array<PropertyType> 
    searchParams: URLSearchParams
    onToggle: () => void
    onHide: () => void
    onChangeDynamicFilters: (categoryPropId: string, value: FilterChoiceValue) => void // DynamicFilters - у каждой категории свои фильтры
    onChangeBrand: (brandId: string) => void // у всех категорий есть бренды
    onChangePrice: (values: RangeSliderValues) => void // у всех категорий есть цены
}


function Filter({className, highestPrice, brands, properties, searchParams, onToggle, onHide, onChangeDynamicFilters, onChangeBrand, onChangePrice}: FilterProps) {  
    useWhyDidYouUpdate('Filter', {className, highestPrice, brands, properties, searchParams, onToggle, onHide, onChangeDynamicFilters, onChangeBrand, onChangePrice});

    const isChecked = useCallback(
        function isChecked(property: PropertyType, choiceValue: FilterChoiceValue) {
            const inputType = property.inputSettings.inputType;            

            if (property.inputSettings.isRange && Array.isArray(choiceValue)) { // Проверка на property.inputSettings.isRange должна идти раньше чем typeof inputType, т.к. при isRange, inputType тоже number
                // const reg = new RegExp( (`${property._id}%5B[gl]te%5D=\\d{1,}\\.{0,1}\\d{0,}`), 'ig' )
                const gteReg = new RegExp( (`${property._id}%5Bgte%5D=\\d{1,}\\.{0,1}\\d{0,}`), 'i' ); // если для создания регулярного выражения используется new RegExp(), Знак элранирование \ нужно писать дважды.
                const lteReg = new RegExp( (`${property._id}%5Blte%5D=\\d{1,}\\.{0,1}\\d{0,}`), 'i' ); // %5B и %5D - это символы [] соответственно (в url они в закодированном виде).    \\d{1,} - одна или более цифр.  \\.{0,1} - число может быть десятичное, тогда где-то может быть или не быть ОДНА точка.   \\d{0,} - после точки может быть сколько угодно чисел
                const gteResult = searchParams.toString().match(gteReg);
                const lteResult = searchParams.toString().match(lteReg);   
                let gteValue: null | number = null;  
                let lteValue: null | number = null;                  
                
                if (gteResult) {
                    const gteIdx = gteResult[0].indexOf('=');
                    if (gteIdx > -1) gteValue = Number(gteResult[0].slice(gteIdx+1));
                }

                if (lteResult) {
                    const lteIdx = lteResult[0].indexOf('=');
                    if (lteIdx > -1) lteValue = Number(lteResult[0].slice(lteIdx+1));
                }

                if (gteValue === choiceValue[0] && lteValue === choiceValue[1]) {
                    return true;
                }
               
                return false;
            }
            else if (typeof inputType === 'string' || typeof inputType === 'number' || typeof inputType === 'boolean') {
                const values = searchParams.getAll(property._id!);
                if (values.includes(String(choiceValue))) return true;
            }
            
            return false;
        },
        [searchParams]
    );
   

    const getFilterChoicesComponents = useCallback(
        function(property: PropertyType) {
            const inputs: Array<ReactNode> = []; // массив checkbox и radio
            if ((property.filterChoices && property.filterChoices.length > 0)) {
                for (let i=0; i<property.filterChoices.length; i+=1) {
                    inputs.push(
                        <CheckboxRadio 
                            key={i}
                            type={property.inputSettings.isRange ? 'radio' : 'checkbox'}
                            name={`${property._id}`} // categoryPropId
                            label={`${property.filterChoices[i].name}`}
                            value={`${property.filterChoices[i].value}`}
                            onChange={() => onChangeDynamicFilters(property._id!, property.filterChoices![i].value)}
                            checked={isChecked(property, property.filterChoices[i].value)}
                            // будем искать products у которых в массиве properties есть объект с полем categoryPropId === атрибуту name и полем value === атрибуту value
                        />
                    )
                }
            }
            return inputs;
        },
        [onChangeDynamicFilters, isChecked]
    );
    

    const getBrandsFilterChoicesComponents = useCallback(
        function getBrandsFilterChoicesComponents() {
            const checkboxes: Array<ReactNode> = []
            for (let i=0; i<brands.length; i+=1) {
                checkboxes.push(
                    <CheckboxRadio
                        key={brands[i]._id}
                        type='checkbox'
                        name={brands[i].name}
                        label={brands[i].name}
                        value={brands[i].name}
                        onChange={() => onChangeBrand(brands[i]._id)}
                        checked={searchParams.getAll('brand') && searchParams.getAll('brand')?.includes(brands[i]._id) ? true : false }
                    />
                );
            }
            return checkboxes;
        },
        [brands, onChangeBrand, searchParams,]
    );
    

    const accordionItems = useMemo(
        function() {
            const items: Array<ReactNode> = [];
          
            const brandFilterComponent = <AccordionItem
                key='brands'
                label='Brands'
                children={getBrandsFilterChoicesComponents()}
            />
            
            items.push(brandFilterComponent);

            if (properties && properties.length > 0) {
                for (let i=0; i<properties.length; i+=1) {
                    if (properties[i].filterable) {
                        items.push(
                            <AccordionItem
                                key={properties[i]._id}
                                label={`${properties[i].name}`}
                                children={getFilterChoicesComponents(properties[i])}
                            />
                        )
                    }
                }
            }
            
            return items;
        },
        [properties, getFilterChoicesComponents, getBrandsFilterChoicesComponents]
    );

    return (
        <div className={className}>
            <Button 
                className='filter__hide-btn'
                onClick={onHide}
            >
                <XIcon/>
            </Button>

            <Button
                className='filter__toggle-btn'
                onClick={onToggle}
            >
                <FilterIcon/>
            </Button>   

            <div key={'price filter'} className='price-filter'>
                <span className='title'>Price</span>
                <div className='slider-wrapper'>
                    <RangeSlider 
                        min={0}
                        max={highestPrice}
                        onChangeValues={onChangePrice}
                        values={[
                            searchParams.get('price[gte]') ? Number(searchParams.get('price[gte]')) : 0,
                            searchParams.get('price[lte]') ? Number(searchParams.get('price[lte]')) : highestPrice
                        ]}
                        tip={true}
                    />
                </div>
            </div>

            <div className='wrapper'>           
                <div className='filter-boody'>
                    {
                        accordionItems.length > 0 &&
                        <Accordion
                            items={accordionItems}
                        />
                    }
                </div>
            </div>            
        </div>
    )
}

export default Filter;