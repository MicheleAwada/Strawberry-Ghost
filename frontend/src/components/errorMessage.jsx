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
    const returnError = {error: "", isError: false}
    const keys = itemLocation.split(/\]\[|\[|\]/).filter(Boolean);
    let isError = false;
    let currentError = error;
    for (const key of keys) {
      if (currentError[key] === undefined) {
        return returnError; // Item doesnt exist
      }
      currentError = currentError[key];
    }
    if (!Array.isArray(currentError)) {
        return returnError
    }
    isError = true;
    
    let stringError = formatError(currentError);
    return {error: stringError, isError: isError};
  }
function getErrorMessage(error, itemLocation) {
    return getFullError(error, itemLocation)[0];
}
function getIsError(error, itemLocation) {
    return getFullError(error, itemLocation)[0];
}
export {getFullError, getErrorMessage, getIsError, formatError}