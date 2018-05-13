import React from 'react';
import './styles.less';

export default class View extends React.Component {

    constructor() {
        super();
        this.image = null;
        this.canvas = null;
        this.state = {
            imageDownloadHref: '',
            imageDownloadName: ''
        };
    };

    renderCanvas(image) {
        const ctx = this.canvas.getContext('2d');
        this.image = image;

        this.canvas.width = image.width;
        this.canvas.height = image.height;
        ctx.drawImage(this.image, 0, 0);
    }

    load = event => {
        let tgt = event.target || window.event.srcElement;
        let image = tgt.files[0];
        this.loadPhoto(image);
    };

    drop = event => {
        event.preventDefault();
        let image = event.dataTransfer.files[0];
        this.loadPhoto(image);
    };

    allowDrop = event => {
        event.preventDefault();
        console.log('allowDrop');
    };

    loadPhoto = image => {
        // FileReader support
        if (FileReader && image) {
            let reader = new FileReader();
            reader.addEventListener('load', () => {
                let image = new Image();
                image.src = reader.result;
                image.addEventListener('load', () => this.renderCanvas(image));
            });
            reader.readAsDataURL(image);
        }
    };

    savePhoto = () => {
        this.setState({
            imageDownloadHref: this.canvas.toDataURL('image/jpeg'),
            imageDownloadName: 'photo-life.jpg'
        });
    };

    render() {
        return (
            <React.Fragment>
                <nav>
                    <img src='./../../img/logo.png' draggable={false}/>
                </nav>
                <header>
                    <input type='file' id='upload-input' accept='.jpg, .jpeg, .png' onChange={this.load}/>
                    <label htmlFor='upload-input'><span>Upload new photo</span></label>
                    <a href={this.state.imageDownloadHref} onClick={this.savePhoto} download={this.state.imageDownloadName}>
                        <span>Save</span>
                    </a>
                </header>
                <aside>

                </aside>
                <section onDrop={this.drop} onDragOver={this.allowDrop}>
                    <canvas width='400' height='300' ref={canvas => canvas && (this.canvas = canvas)}/>
                </section>
            </React.Fragment>
        );
    }
}