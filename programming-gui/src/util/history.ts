import { useMemo, useState } from "react";
import _ from "underscore";

//all code from https://medium.com/geekculture/react-hook-to-allow-undo-redo-d9d791c5cd94

export default function useUndoableState(init) {
    const [states, setStates] = useState([init]); // Used to store history of all states
    const [index, setIndex] = useState(0); // Index of current state within `states`
    const state = useMemo(() => states[index], [states, index]); // Current state
    const setState = (value) => {
        // If state has not changed, return to avoid triggering a re-render
        if (_.isEqual(state, value)) {
            return;
        }
        const copy = states.slice(0, index + 1); // This removes all future (redo) states after current index
        copy.push(value);
        setStates(copy);
        setIndex(copy.length - 1);
    };
    // Clear all state history
    const resetState = (init) => {
        setIndex(0);
        setStates([init]);
    };
    // Allows you to go back (undo) N steps
    const goBack = (steps = 1) => {
        setIndex(Math.max(0, Number(index) - (Number(steps) || 1)));
    };
    // Allows you to go forward (redo) N steps
    const goForward = (steps = 1) => {
        setIndex(Math.min(states.length - 1, Number(index) + (Number(steps) || 1)));
    };
    return {
        state,
        setState,
        goBack,
        goForward,
    };
}