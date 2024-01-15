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
    
    let stringError = currentError.join(", ");
    return {error: stringError, isError: isError};
  }
function getErrorMessage(error, itemLocation) {
    return getFullError(error, itemLocation).error;
}
function getIsError(error, itemLocation) {
    return getFullError(error, itemLocation).isError;
}
export {getFullError, getErrorMessage, getIsError}