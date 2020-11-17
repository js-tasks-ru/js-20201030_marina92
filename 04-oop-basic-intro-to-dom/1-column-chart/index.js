export default class ColumnChart {
  subElements = {};
  chartHeight = 50;

  constructor({
    data = [],
    label = '',
    link = '',
    value = 0
  } = {}){
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;

    this.render();
  }

  getColumnBody(data){
    /*Получение колонок чарта*/
    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;

    return data
    .map(item => {
      const percent = (item / maxValue * 100).toFixed(0);
      return `<div style="--value: ${Math.floor(item * scale)}" data-tooltip="${percent}%"></div>`;
    })
    .join('');
  }

  get template(){
    return `
  <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
    <div class="column-chart__title">
      Total ${this.label}
      ${this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : ''}
    </div>
    <div class="column-chart__container">
      <div data-element="header" class="column-chart__header">
      ${this.value}
      </div>
      <div data-element="body" class="column-chart__chart">
      ${this.getColumnBody(this.data)}
      </div>
    </div>
  </div>`;
  }

  render() {
    //Создаем новый элемент
    const elem = document.createElement('div');
    //Вставляем в него шаблон
    elem.innerHTML = this.template;
    //Берем 1 дочерний элемент и записываем его в свойство класса
    this.element = elem.firstElementChild;

    if(this.data.length){ //В массиве есть элементы
      //Возвращает массив классов элемента
      //Удаляет класс 'column-chart_loading' у элемента
      this.element.classList.remove('column-chart_loading');
    }

    //Записывает в свойство класса - объект с поляими header и body
    this.subElements = this.getSubElements(this.element);
  }

  getSubElements(element){
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((result, subElement) => {
      //Добавляем свойства объекту. Имя свойства - subElement.dataset.element
      result[subElement.dataset.element] = subElement;
      return result;
    }, {});
  }

  update(data){
    //Обновление данных в колонках
    this.subElements.body.innerHTML = this.getColumnBody(data);
  }

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}
