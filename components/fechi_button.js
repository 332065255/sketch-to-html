const util = require('../util');
const GroupLayer = require('../layer/Group');

class Button extends GroupLayer {
    constructor () {
        super();
    }

    getStyle () {
        let otherStyl;
        let frameStyle = {
            position: 'absolute',
            left: util.px2rem(this.layer.frame.x),
            top: util.px2rem(this.layer.frame.y),
            width: util.px2rem(this.layer.frame.width),
            height: util.px2rem(this.layer.frame.height),
            'transform': this.layer.style.transform ? this.layer.style.transform.join(' ') : null,
            'box-shadow': this.layer.style.boxShadow,
            'background': this.layer.style.linearGradientString,
            'opacity': this.layer.style.opacity,
        };
        return Object.assign({}, frameStyle);
    }

    getHtml (childString) {
        let layer = this.layer;
        if(layer.overrideValues){
            layer.overrideValues.map(data=>{
                if(data._class == 'overrideValue'){
                    childString = data.value;
                }
            })
        }
        return `<Button id="${layer.id}" class="${layer.symbolJson.type}" text="${childString}" style="${util.getStyleString(layer.finalStyle)}" ></Button>`;
    }
}

module.exports = Button;