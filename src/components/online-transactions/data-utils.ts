export const sortColumn = (json: { [key: string]: any }[], colIndex: number): { [key: string]: any }[] => {
    // console.log(json);
    json.reverse();
    return json;
};

export default { sortColumn };
