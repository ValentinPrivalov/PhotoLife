import React from 'react';
import './styles.less';

export default class View extends React.Component {

    constructor() {
        super();

        this.image = null;
        this.canvas = null;
    };

    prepareCanvas(image) {
        const ctx = this.canvas.getContext('2d');
        this.image = image;

        this.canvas.width = image.width;
        this.canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
    }

    onChange = event => {
        let tgt = event.target || window.event.srcElement;
        let files = tgt.files;

        // FileReader support
        if (FileReader && files && files.length) {
            let fr = new FileReader();
            fr.addEventListener('load', () => {
                let image = new Image();
                image.src = fr.result;
                image.addEventListener('load', () => this.prepareCanvas(image));
            });
            fr.readAsDataURL(files[0]);
        }
    };

    render() {
        return (
            <section>
                <input type='file' id='upload-input' accept='.jpg, .jpeg, .png' onChange={this.onChange}/>
                <label htmlFor='upload-input'>Upload file</label>
                <canvas width='400' height='300' ref={canvas => canvas && (this.canvas = canvas)}/>
            </section>
        );
    }
}