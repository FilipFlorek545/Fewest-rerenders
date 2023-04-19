
export const initial = (props) => {
    return props.reduce((acc, curr) => {
        acc[curr.name.toLowerCase()] = ''
        return acc
    }, {})
};
