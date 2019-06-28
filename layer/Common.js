const util = require('../util');
const StyleStore = require('../store/StyleStore');
const path = require('path');
const LayerProtocol = require('./LayerProtocol');
/**
 * hasClippingMask   属性,是否是一个蒙版
 */
class CommonLayer extends LayerProtocol {
    constructor () {
        super();
    }

    getStyle () {
        
        let width = this.layer.frame.width, height = this.layer.frame.height;
        console.log(this.layer.name)
        // console.log('父级:',this.parentLayer)
        if(this.parentLayer&&this.parentLayer.isMask){
            this.layer.frame.x = this.layer.frame.x - this.parentLayer.frame.x
            this.layer.frame.y = this.layer.frame.y - this.parentLayer.frame.y
        }
        let otherStyle = {
            'color': this.layer.style.color,
            'background-image': this.layer.style.backgroundImage ? `url(${path.join(this.imagePath, this.layer.style.backgroundImage)}.png)` : null,
            'background-color': this.layer.style.backgroundColor,
            'background': this.layer.style.linearGradientString,
            'border-radius': util.px2rem(this.layer.style.borderRadius),
            'border-color': this.layer.style.borderColor,
            'border-width': util.px2rem(this.layer.style.borderWidth),
            'border-style': this.layer.style.borderStyle,
            'box-shadow': this.layer.style.boxShadow,
        };
        console.log(this.layer.name,this.layer.style)
        let parentOtherStyle = {};

        if(this.parentLayer && this.parentLayer.type == 'shapeGroup') {
            parentOtherStyle = {
                'color': this.parentLayer.style.color,
                'background-color': this.parentLayer.style.backgroundColor,
                'background-image': this.parentLayer.style.backgroundImage ? `url(${path.join(this.imagePath, this.parentLayer.style.backgroundImage)}.png)` : null,
                'background': this.parentLayer.style.linearGradientString,
                'border-color': this.parentLayer.style.borderColor,
                'border-width': util.px2rem(this.parentLayer.style.borderWidth),
                'border-style': this.parentLayer.style.borderStyle,
                'border-radius': util.px2rem(this.parentLayer.style.borderRadius),
            };
            let borderWidth = this.parentLayer.style.borderWidth || 0;
            if(this.parentLayer.style.borderPosition == 0) {
                // center
                width = width - borderWidth;
                height = height - borderWidth;
            } else if(this.parentLayer.style.borderPosition == 1) {
                // inside
                let borderWidth = this.parentLayer.style.borderWidth || 0;
                width = width - borderWidth * 2;
                height = height - borderWidth * 2;
            }
            delete this.parentLayer.finalStyle['background']
            delete this.parentLayer.finalStyle['background-image']
            delete this.parentLayer.finalStyle['background-color']

        }
        
        let frameStyle = {
            'position': 'absolute',
            'left': util.px2rem(this.layer.frame.x),
            'top': util.px2rem(this.layer.frame.y),
            'width': util.px2rem(width),
            'height': util.px2rem(height),
            'transform': this.layer.style.transform ? this.layer.style.transform.join(' ') : null,
            'box-shadow': this.layer.style.boxShadow,
            'background': this.layer.style.linearGradientString,
            'opacity': this.layer.style.opacity,
        };
        if(this.layer.type == 'artboard'){
            frameStyle.overflow ='hidden'
        }

        if(!util.isH5){
            if(this.layer.type == 'artboard'){
                frameStyle.position='relative';
                frameStyle.left='50%';
                frameStyle["transform"]="translateX(-50%)";
                frameStyle["-webkit-transform"]="translateX(-50%)";
            }
        }
        
        let style = Object.assign({}, frameStyle, otherStyle);
        style = util.assign(parentOtherStyle, style);
        let finalStyle;

        if(StyleStore.get(this.selector)) {
            finalStyle = style;
        } else {
            StyleStore.set(this.selector, style);
            finalStyle = style;
        }
        if (this.layer.type === 'Artboard') {
          finalStyle.background = '#fff';
        }
        
        return finalStyle;
    }

    getHtml (childString) {
        let layer = this.layer;
        // console.log(layer.name,layer.finalStyle)
        return `<div id="${layer.id}" ${this.getClass(layer.name)} style=${util.getStyleString(layer.finalStyle)}>
            ${childString}
            </div>
        `;
    }
}

module.exports = CommonLayer;