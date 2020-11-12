/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    let key;
    let strTemp = '';
    let res = '';
    
    for(let i = 0; i <= string.length; i++){
      if(string[i] != key){
        if(strTemp != ''){
          res += strTemp.substr(0, size);
        }
        strTemp = '';
        key = string[i];
      }
      strTemp += string[i];
    }

    return res;
}
