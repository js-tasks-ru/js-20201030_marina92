export default class SortableTable {
    element;
    subElements;
  
    constructor(header = [], { data = []}){
      this.headerList = header;
      this.dataList = data;
      this.showElement();
    }

    arrowTemplate = `
    <span data-element="arrow" class="sortable-table__sort-arrow">
      <span class="sort-arrow"></span>
    </span>`;

    showElement(){
      const elem = document.createElement('div');
      elem.innerHTML = this.getTemplate();
      this.element = elem.firstElementChild;
      this.subElements = this.getSubElements(this.element);
      const myEvent = (event) => {
        let target = event.target;        
        if (target.tagName == 'SPAN'){
            target = target.parentNode;
        }
  
        const fieldValue = target.dataset.id;
        let orderValue;
        switch(target.dataset.order){
          case 'asc': orderValue = 'desc'; break;
          case 'desc': orderValue = 'asc'; break;
          default: orderValue = 'desc'; break;
        }
  
        this.sort(fieldValue, orderValue);
      };
      this.subElements.header.addEventListener('pointerdown', myEvent);
      this.sort('title','asc');
    }

    getSubElements(element){
      const elements = element.querySelectorAll('[data-element]');
  
      return [...elements].reduce((result, subElement) => {
        //Добавляем свойства объекту. Имя свойства - subElement.dataset.element
        result[subElement.dataset.element] = subElement;
        return result;
      }, {});
    }

    getTemplate(){
        const template = `
        <div data-element="productsContainer" class="products-list__container">
          <div class="sortable-table">
            <div data-element="header" class="sortable-table__header sortable-table__row">${this.getColumn()}</div>  
            <div data-element="body" class="sortable-table__body">${this.getRow()}</div>
          </div>
        </div>`;
        return template;
    }

    getColumn(colName = "title"){
      const res = this.headerList.map(item => {
        const r = `<div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order=""><span>${item.title}</span>
                    ${this.arrowTemplate}</div>`;
        return r;
      });

      return res.join('');
    }

    getRow(){
        const res = this.dataList.map(row => {
          const pathBegin = `<a href="/products/3d-ochki-epson-elpgs03" class="sortable-table__row">`;
          const resData = this.headerList.map(itemcol => {
              if(itemcol.id === "images"){
                  return itemcol.template(row.images);
              }
              else{
                  return `<div class="sortable-table__cell">${row[itemcol.id]}</div>`;
              }
            }).join('');
  
          const pathEnd = `</a>`;
          return pathBegin + resData + pathEnd;
        });
       
        return res.join('');
    }
  
    sort(fieldValue, orderValue){
        //здесь сортировка
        const field = this.headerList.find(item => item.id === fieldValue);
        if(field.sortable){
            switch(orderValue){
                case 'asc': this.dataList = this.sorting(1, field); break;
                case 'desc': this.dataList =  this.sorting(-1, field); break;
                default: return;
            }
        }
        //Обновляем строки в таблице
        this.subElements.body.innerHTML = this.getRow();
        const allColumn = this.element.querySelectorAll('.sortable-table__cell[data-id]');
        const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${field.id}"]`);
        for(let el of allColumn){
            el.dataset.order = '';
        }

        currentColumn.dataset.order = orderValue;
    }

    sorting(i, field = {}){
        switch(field.sortType){
            case "number": return [...this.dataList].sort((a,b)=> i * (a[field.id] - b[field.id]));
            case "string": return [...this.dataList].sort((a,b)=> i * a[field.id].localeCompare(b[field.id], ['ru'], { caseFirst: 'upper' }));
        }
    }

    remove () {
        if(this.element != null){
            this.element.remove();
        }
    }
    
    destroy() {
        this.remove();
        this.element = null;
        this.subElements = {};
    }
}
