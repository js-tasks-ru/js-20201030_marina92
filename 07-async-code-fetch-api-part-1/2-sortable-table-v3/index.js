import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
    element;
    subElements;
    headerList;
    dataList;
    sorted;
    url;
    isBackend;
    loading = false;
  
    constructor(header = [], {
        data = [],
        sorted = {
          id: header.find(a => a.sortable).id,
          order: 'asc'
        },
        url = '',
        start = 0,
        step = 20,
        end = start + step}){
      this.headerList = header;
      this.dataList = data;
      this.sorted = sorted;
      this.isBackend = url != '';
      this.start = start;
      this.step = step;
      this.end = end;
      this.url = new URL(url, BACKEND_URL);

      this.render();
    }

    arrowTemplate = `
    <span data-element="arrow" class="sortable-table__sort-arrow">
      <span class="sort-arrow"></span>
    </span>`;

    onSortColumn = async event =>{
      const column = event.target.closest('[data-sortable="true"]')
      if(column){
        const { id, order } = column.dataset;
        if(this.isBackend){
          const res = await this.sortOnServer(id, this.getOrder(order), this.start, this.end);
          this.dataList = res;
        }
        else{
          this.sort(id, this.getOrder(order));    
        }  

        column.dataset.order = this.getOrder(order);
        //Проставляем треугольник
        const arrow = column.querySelector(`.sortable-table__sort-arrow`);
        if(!arrow){          
          column.append(this.subElements.arrow);
        }
        this.subElements.body.innerHTML = this.getRow();
      }
    }
    
    onWindowScroll = async () => {
      const { bottom } = this.element.getBoundingClientRect();
      const { id, order } = this.sorted;
      if(bottom < document.documentElement.clientHeight && !this.loading && this.isBackend){
        this.start = this.end;
        this.end = this.start + this.step;
        this.loading = true;
        const res = await this.sortOnServer(id, order, this.start, this.end);
        this.dataList = this.dataList.concat(res);
        this.subElements.body.innerHTML = this.getRow();
        this.subElements.header.innerHTML = this.getColumn();
        this.loading = false;
      }
    }

    getOrder(order){
      switch(order){
        case 'asc': return 'desc'; break;
        case 'desc': return 'asc'; break;
        default: return 'asc'; break;
      }
    }

    async render(){
        const elem = document.createElement('div');
        elem.innerHTML = this.getTemplate();
        this.element = elem.firstElementChild;
        this.subElements = this.getSubElements(this.element);

        if(this.isBackend){
          const res = await this.sortOnServer(this.sorted.id, this.sorted.order, this.start, this.end);
          this.dataList = res;
        }
        else{
          this.sort(this.sorted.id, this.sorted.order); 
        } 
        
        this.subElements.body.innerHTML = this.getRow();
        this.subElements.header.innerHTML = this.getColumn();

        this.subElements.header.addEventListener('pointerdown', this.onSortColumn);
        window.addEventListener('scroll', this.onWindowScroll);
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
    <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
    <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
      <div>
        <p>No products satisfies your filter criteria</p>
        <button type="button" class="button-primary-outline">Reset all filters</button>
      </div>
    </div>
  </div>
</div>`;
        return template;
    }

    getColumn(){
      const res = this.headerList.map(item => {
        const r = `<div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}"
                      data-order="${item.id === this.sorted.id ? this.sorted.order : ''}"><span>${item.title}</span>
                    ${item.id === this.sorted.id ? this.arrowTemplate : ''}
                    </div>`;
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
    }

    async sortOnServer(field, order, start, end){
        this.url.searchParams.set('_embed', 'subcategory.category');
        this.url.searchParams.set('_sort', field);
        this.url.searchParams.set('_order', order);
        this.url.searchParams.set('_start', start);
        this.url.searchParams.set('_end', end);

        this.element.classList.add('sortable-table__loading');

        const res = await fetchJson(this.url);
        if(res && Object.values(res).length){
            this.element.classList.remove('sortable-table__loading');
        }
        return res;
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
