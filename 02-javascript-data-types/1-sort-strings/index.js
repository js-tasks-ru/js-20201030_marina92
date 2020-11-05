/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const arrNew = new Array();
  for (let i = 0; i < arr.length; i++) {
      let b = false;
      for (let j = 0; j < arrNew.length; j++) {
          const sr = arr[i].localeCompare(arrNew[j], ['ru', 'en'], { caseFirst: 'upper' });
          if(sr < 1){
              arrNew.splice(j, 0 , arr[i]);
              b = true;
              break;
          }
        }
        if(!b){
            arrNew.push(arr[i]);
        }
    }

    if(param == 'desc'){
      return arrNew.reverse();
    }
    else{
        return arrNew;          
    }
  }
