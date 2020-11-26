import fetchJson from './utils/fetch-json.js';

export default class ColumnChart {
  subElements = {};
  chartHeight = 50;
  urlDir = "https://course-js.javascript.ru";

  constructor({
    label = '',
    link = '',
    formatHeading = data => data,    
    range = {
      from: new Date(),
      to: new Date()
    },
    url = ''
  } = {}){
    this.label = label;
    this.link = link;
    this.range = range;
    this.formatHeading = formatHeading;
    this.url = new URL(url, this.urlDir);

    this.render();
    this.update(range.from, range.to);
  }

  getColumnBody(data){
    if(!data) return;
    const dataent = Object.entries(data);
    const numbers = Object.values(data);
    const maxValue = Math.max(...numbers);
    const scale = this.chartHeight / maxValue;

    return dataent.map(item => {
      const num = item[1];
      const percent = (num / maxValue * 100).toFixed(0);
      const res = `<div style="--value: ${Math.floor(num * scale)}" data-tooltip="${percent}%"></div>`;
      return res;
    })
    .join('');
  }

  getTextHeader(data){
    return this.formatHeading(Object.values(data).reduce((a,b) => (a + b), 0));
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
      </div>
      <div data-element="body" class="column-chart__chart">
      </div>
    </div>
  </div>`;
  }

  render() {
    const elem = document.createElement('div');
    elem.innerHTML = this.template;
    this.element = elem.firstElementChild;
    this.subElements = this.getSubElements(this.element);
  }

  getSubElements(element){
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((result, subElement) => {
      result[subElement.dataset.element] = subElement;
      return result;
    }, {});
  }

  async update(dateF, dateL){
    this.element.classList.add('column-chart_loading');
    this.subElements.body.innerHTML = '';
    this.subElements.header.textContent = '';

    this.url.searchParams.set('from', dateF.toISOString());
    this.url.searchParams.set('to', dateL.toISOString());

    this.range.from = dateF;
    this.range.to = dateL;

    const res = await fetchJson(this.url);
    
    if(res && Object.values(res).length){
      this.subElements.body.innerHTML = this.getColumnBody(res);
      this.subElements.header.textContent = this.getTextHeader(res);
      this.element.classList.remove('column-chart_loading');
    }
  }
  
  remove () {
    if(this.element){
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}
