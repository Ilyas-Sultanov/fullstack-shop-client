function debounce(fn: (...args: any[]) => void, ms: number) {
    let timeout: number;
    return function(...args: any[]) {
        const fnCall = () => {fn(...args)}
        clearTimeout(timeout);
        timeout = window.setTimeout(fnCall, ms);
    }
}

export default debounce;