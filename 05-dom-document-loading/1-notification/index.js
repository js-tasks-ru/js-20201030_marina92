export default class NotificationMessage {
    nameElement = 'notification';
    element;

    constructor(mes = '', { duration = 0, type = ''} = {}){
        this.message = mes;
        this.duration = duration;
        this.type = type;
        this.render();
    }

    render(){
        //Создаем элемент
        const elem = document.createElement('div');
        elem.innerHTML = this.getTemplate();
        this.element = elem.firstElementChild;
    }

    show(elemDir){
        if(elemDir === undefined){
            elemDir = document.body;
        }

        //Поиск элемента в elemDir.
        const elemDoc = elemDir.querySelector('.' + this.nameElement);
        if(elemDoc === null){
            //Не нашли - добавляем
            elemDir.append(this.element);            
        }
        
        //Удаляем элемент
        setTimeout((el) => this.remove(), this.duration, this.element);
    }

    getTemplate(){
        return `
        <div class="${this.nameElement} ${this.type}" style="--value:${this.duration / 1000}s">
            <div class="timer"></div>
            <div class="inner-wrapper">
                <div class="notification-header">${this.type}</div>
                <div class="notification-body">
                    ${this.message}
                </div>
            </div>
        </div>`;
    }

    remove () {
        if(this.element != null){
            this.element.remove();
        }
    }
    
    destroy() {
        this.remove();
        this.element = null;
    }
}
