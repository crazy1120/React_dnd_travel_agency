export const isEquivalent = (a, b) => {
  if (typeof a === "function" || typeof b === "function") {
    return false;
  } else if (typeof a !== "object" || typeof b !== "object") {
    return a === b;
  }

  // Create arrays of property names
  let aProps = a ? Object.getOwnPropertyNames(a) : [];
  let bProps = b ? Object.getOwnPropertyNames(b) : [];

  // If number of properties is different,
  // objects are not equivalent
  if (aProps.length !== bProps.length) {
    return false;
  }

  for (var i = 0; i < aProps.length; i++) {
    let propName = aProps[i];

    // If values of same property are not equal,
    // objects are not equivalent
    if (propName !== "key" && !isEquivalent(a[propName], b[propName])) {
      return false;
    }
  }

  // If we made it this far, objects
  // are considered equivalent
  return true;
};

export const diff = (obj1, obj2) => {
  // Make sure an object to compare is provided
  if (!obj2 || Object.prototype.toString.call(obj2) !== "[object Object]") {
    return obj1;
  }

  //
  // Variables
  //

  let diffs = {};
  let key;

  //
  // Methods
  //

  /**
   * Check if two arrays are equal
   * @param  {Array}   arr1 The first array
   * @param  {Array}   arr2 The second array
   * @return {Boolean}      If true, both arrays are equal
   */
  let arraysMatch = function (arr1, arr2) {
    // Check if the arrays are the same length
    if (arr1.length !== arr2.length) return false;

    // Check if all items exist and are in the same order
    for (var i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }

    // Otherwise, return true
    return true;
  };

  /**
   * Compare two items and push non-matches to object
   * @param  {*}      item1 The first item
   * @param  {*}      item2 The second item
   * @param  {String} key   The key in our object
   */
  const compare = function (item1, item2, key) {
    // Get the object type
    let type1 = Object.prototype.toString.call(item1);
    let type2 = Object.prototype.toString.call(item2);

    // If type2 is undefined it has been removed
    if (type2 === "[object Undefined]") {
      diffs[key] = null;
      return;
    }

    // If items are different types
    if (type1 !== type2) {
      diffs[key] = item2;
      return;
    }

    // If an object, compare recursively
    if (type1 === "[object Object]") {
      let objDiff = diff(item1, item2);
      if (Object.keys(objDiff).length > 0) {
        diffs[key] = objDiff;
      }
      return;
    }

    // If an array, compare
    if (type1 === "[object Array]") {
      if (!arraysMatch(item1, item2)) {
        diffs[key] = item2;
      }
      return;
    }

    // Else if it's a function, convert to a string and compare
    // Otherwise, just compare
    if (type1 === "[object Function]") {
      if (item1.toString() !== item2.toString()) {
        diffs[key] = item2;
      }
    } else {
      if (item1 !== item2) {
        diffs[key] = item2;
      }
    }
  };

  //
  // Compare our objects
  //

  // Loop through the first object
  for (key in obj1) {
    if (obj1.hasOwnProperty(key)) {
      compare(obj1[key], obj2[key], key);
    }
  }

  // Loop through the second object and find missing items
  for (key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (!obj1[key] && obj1[key] !== obj2[key]) {
        diffs[key] = obj2[key];
      }
    }
  }

  // Return the object of differences
  return diffs;
};

export const nextId = (elements) => {
  if (elements.length) {
    let arrayOfIntCodes = elements
      .filter((el) => el.type != "other")
      .map((el) => el.code.replace(/^\D+/g, ""))
      .filter((el) => el.length > 0);
    if (arrayOfIntCodes.length) {
      let intCodes = arrayOfIntCodes
        .map((el) => parseInt(el))
        .sort(function (a, b) {
          return a - b;
        });
      if (intCodes) {
        return intCodes[intCodes.length - 1] + 1;
      }
    }
  }
  return 1;
};

export const instructionByCode = (component, code) =>
  component.instructionList
    ? component.instructionList.find((el) => el.code === code)
    : undefined;

export const stripTags = (string) => {
  return string
    ? string
        .replace(/<[^>]*>?/gm, "")
        .replace("\n", "")
        .replace("&nbsp;", "")
    : string;
};

export const isQuestion = (code) => /^Q[a-z0-9_]+$/.test(code);
export const isGroup = (code) => /^G[a-z0-9_]+$/.test(code);

export const lastIndexInArray = (array, func) => {
  if (!array) {
    return -1;
  }
  let index = array.length - 1;
  for (; index >= 0; index--) {
    if (func(array[index])) {
      return index;
    }
  }
  return -1;
};

export const isNotEmptyHtml = (value) => value && /[^<br><p><\/p>\s]/gm.test(value)
