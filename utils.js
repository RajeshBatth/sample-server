function removeUniqueObjects(arr) {
  const seenObjects = new Set();
  const duplicates = [];

  for (const obj of arr) {
    let isDuplicate = false;

    for (const duplicate of duplicates) {
      if (isDeepEqual(obj, duplicate)) {
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate) {
      duplicates.push(obj);
    }

    seenObjects.add(obj);
  }

  return duplicates;
}

function isDeepEqual(objA, objB) {
  return JSON.stringify(objA) === JSON.stringify(objB);
}

function paginate(arr, offset, limit) {
  const startIndex = offset * limit;
  const endIndex = startIndex + limit;
  return arr.slice(startIndex, endIndex);
}


module.exports = {
  removeUniqueObjects,
  paginate
}
