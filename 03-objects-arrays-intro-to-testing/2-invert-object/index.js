/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
    if(obj === undefined){
        return obj;
    }
    const res = {};
    for(let el of Object.entries(obj)){
      res[el[1]] = el[0];
    }
    return res;
}
