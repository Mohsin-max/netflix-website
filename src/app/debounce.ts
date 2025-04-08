import { Movie } from "./interfaces/movie";

// This function takes two parameters: func and delay
export function debounce(func: Function, delay: number) {

    // A variable to store the timeout ID, initially set to null
    let timeoutId: any = null;

    // The wrapper function will be returned by debounce and will accept the event object
    return function (event: any) {

        // If there's an existing timeout, clear it to reset the timer
        if (timeoutId !== null) clearTimeout(timeoutId)

        // Set a new timeout and call the function after the specified delay
        timeoutId = setTimeout(() => func(event.target.value), delay);
    };
}

