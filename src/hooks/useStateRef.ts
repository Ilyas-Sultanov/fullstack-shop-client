import { useRef, useState, RefObject } from 'react';

function useStateRef<T>(defaultValue: T): [T, (value: T) => void, RefObject<T>] {
    const ref = useRef<T>(defaultValue);
    const [state, _setState] = useState<T>(defaultValue);

    const setState = (value: T) => {
        _setState(value);
        ref.current = value;
    };

    return [state, setState, ref];
}

export default useStateRef;

/**
 * You can replace all your useState with this and you will always have the latest state.
 * In React when functions accessing the state they receive the state from the moment the function defined - not the current state.
 * So if the state changed, your functions and effects my use older state.
 * Using useRef, can solve it because it have always one value. But when you update the Ref it's not re-render.
 * It's fully support the useState API, so you can change your useState to useStateRef and it will not break your app.
 */


/**
 * The differences between useRef and useState:
 * -Both preserve their data during render cycles and UI updates, but only the useState Hook with its updater function causes re-renders.
 * -useRef returns an object with a current property holding the actual value. In contrast, useState returns an array with two elements: the first item constitutes the state, and the second item represents the state updater function
 * -useRef‘s current property is mutable, but useState‘s state variable not. In contrast to the current property of useRef, you should not directly assign values to the state variable of useState. Instead, always use the updater function (i.e., the second array item). As the React team recommends in the documentation for setState in class-based components (but still true for function components), treat state like an immutable variable
 * -useState and useRef can be considered data Hooks, but only useRef can be used in yet another field of application: to gain direct access to React components or DOM elements
 */


//  See the example code:

// function MyComponent(){
//     var [counter,setCounter]=useState(0)

//     function increment(){
//         setCount(counter+1)
//         alert(counter) // will show 0 since the state not updated yet.			
//     }

//     useEffect(()=>{
//         alert(counter) // Whatever is the current state. It always alert 0
//         return ()=>{
//             alert(counter) // On unmount it still alert 0, even if you called increment many times.
//         }
//     },[])

//     return (
//        <div>
//            Current number: {counter}
//            <button onClick={increment}>
//            Increment
//            </button>
//        </div>
//     )
// }

// To solve it I created a new hook useStateRef
// See it in action:

// import useStateRef from './useStateRef'
// function MyComponent(){
//     var [counter,setCounter,counterRef] = useStateRef(0)
//     function increment(){
//         setCount(counter+1)
//         alert(counterRef.current) // will show 1
//     }
//     useEffect(()=>{
//         alert(counterRef.current) // Always show the last value
//         return ()=>{
//             alert(counterRef.current) // // Always show the last value
//         }
//     },[])
//     return (
//         <div>
//             Current number: {counter}
//             <button onClick={increment}>
//             Increment
//             </button>
//         </div>
//     )
// }