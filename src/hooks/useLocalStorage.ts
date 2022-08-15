import { useState, useEffect } from 'react';

type useLocalStorageReturnType<T> = [T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>];

function useLocalStorage<T>(key: string, initialValue?: T): useLocalStorageReturnType<T> {
    function getValue(): T | undefined {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : initialValue ? initialValue : undefined;
    }

    const [state, setState] = useState<T | undefined>(getValue());

    useEffect(
        function() {
            if (state) {
                localStorage.setItem(key, JSON.stringify(state));
            }
            else {
                localStorage.removeItem(key);
            }
        }, 
        [state, key]
    );

    return [state, setState];
};

export default useLocalStorage;

// const [value, setValue] = useLocalStorage('itemKey', 'initialValue');
// const [selectedCat, setSelectedCat] = useLocalStorage<IResponseCategory>('selectedCategory');