function getErrorMessage(error, itemLocation) {
    const keys = itemLocation.split(/\]\[|\[|\]/).filter(Boolean);
    let isError = false;
    let currentError = error;
    for (const key of keys) {
      if (currentError[key] === undefined) {
        return ""; // Item doesnt exist
      }
      currentError = currentError[key];
    }
    if (!Array.isArray(currentError)) {
        return ""
    }
    isError = true;
    
    let stringError = currentError.join(", ");
    return {error: stringError, isError: isError};
  }
export {getErrorMessage}