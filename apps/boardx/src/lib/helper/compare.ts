export function compareArrays(arr1: any, arr2: any): boolean {
  // First, check if the arrays are of the same length
  if (arr1.length !== arr2.length) return false;

  // Compare objects in the arrays one by one
  for (let i = 0; i < arr1.length; i++) {
    if (!compareObjects(arr1[i], arr2[i])) {
      return false;
    }
  }

  return true;
}

// Helper function to compare two objects
export function compareObjects(obj1: any, obj2: any): boolean {
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);

  // Check if both objects have the same number of properties
  if (obj1Keys.length !== obj2Keys.length) return false;

  // Check if the values for each key are the same
  for (const key of obj1Keys) {
    console.log(key, obj1[key]=== obj2[key]);
    
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}
