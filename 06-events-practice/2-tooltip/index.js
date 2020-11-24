class Tooltip {
    static instance;
    element;

    //Курсор оказывается над элементом
    onMouseOver = event =>{
      //Ищем ближайшего родителя
        const elem = event.target.closest('[data-tooltip]');
        if(elem){
          //Создаем элемент. Передаем значение атрибута data-tooltip
            this.render(elem.dataset.tooltip);
            this.moveTooltip(event);
            document.addEventListener('pointermove', this.onMouseMove);
        }
    };

    //Курсор уходит с элемента
    onMouseOut = () =>{
      //Удаляем элемент tooltip
        this.removeTooltip();
    }

    //Происходит при движении мыши
    onMouseMove = event=> {
        this.moveTooltip(event);
    }

    removeTooltip(){
        if(this.element){
            this.element.remove();
            this.element = null;
            document.removeEventListener('pointermove', this.onMouseMove);
        }
    }

    constructor(){
        if(Tooltip.instance){
            return Tooltip.instance;
        }
        Tooltip.instance = this;
    }

    //Добавляем события
    initEventListeners(){
      //Курсор заходит на элемент
        document.addEventListener('pointerover', this.onMouseOver);
        //Курсор уходит с элемента
        document.addEventListener('pointerout', this.onMouseOut);
    }

    //Создаем элемент. html - текст
    render(html){
        this.element = document.createElement('div');
        this.element.className = 'tooltip';
        this.element.innerHTML = html;
        document.body.append(this.element);
    }

    initialize(){
        this.initEventListeners();
    }

    //Получает координаты мыши и меняет расположение элемента
    moveTooltip(event){
        const left = event.clientX + 10;
        const top = event.clientY + 10;

        this.element.style.left = `${left}px`;
        this.element.style.top = `${top}px`;
    }
    
    destroy() {
        document.removeEventListener('pointerover', this.onMouseOver);
        document.removeEventListener('pointerout', this.onMouseOut);
        this.removeTooltip();
    }
}

const tooltip = new Tooltip();

export default tooltip;
