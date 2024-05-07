exports.filterInputData = (inputData, allowedField) => {
   const filtered = {};
   Object.keys(inputData).forEach((data) => {
      if (allowedField.includes(data)) filtered[data] = inputData[data];
   })
   return filtered
};