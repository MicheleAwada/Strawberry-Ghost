function formatError(errorArray) {
    if (!Array.isArray(errorArray) || errorArray.length === 0) {
      return null;
    }
    const clonedErrorArray = [...errorArray];
    const lastElement = clonedErrorArray.pop();
  
    if (clonedErrorArray.length > 0) {
      return clonedErrorArray.join(", ") + ", and " + lastElement;
    } else {
      return lastElement;
    }
  }

function getFullError(error, itemLocation) {
    const keys = itemLocation.split(/\]\[|\[|\]/).filter(Boolean);
    let isError = false;
    let currentError = error;
    for (const key of keys) {
      if (currentError[key] === undefined) {
        return {error: null, isError: isError}; // Item doesnt exist
      }
      currentError = currentError[key];
    }
    if (!Array.isArray(currentError)) {
        return {error: currentError, isError: isError};
    }
    isError = true;
    
    let stringError = formatError(currentError);
    return {error: stringError, isError: isError};
  }
function getErrorMessage(error, itemLocation) {
    return getFullError(error, itemLocation).error;
}
function getIsError(error, itemLocation) {
    return getFullError(error, itemLocation).isError;
}
export {getFullError, getErrorMessage, getIsError, formatError}