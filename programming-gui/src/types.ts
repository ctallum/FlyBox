interface Item {
    start: number,
    end: number,
    id: number,
    group: string,
    sunset?: boolean,
    frequency?: number,
    intensity?: number
}

export default Item;