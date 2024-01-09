function flattenArray(array) {
    return array.reduce((acc, val) => {
        if (Array.isArray(val)) {
            return flattenArray([...acc, ...val])
        }
        else {
            return [...acc, val]
        }
    }, [])
}



export {flattenArray}