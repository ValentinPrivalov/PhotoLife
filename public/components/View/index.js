import React from 'react';
import './styles.less';

let ctx = null;

export default class View extends React.Component {

    constructor() {
        super();
        this.image = new Image();


        this.image.src = '/img/photo1.jpg';
        this.image.addEventListener('load', () => {
            this.renderCanvas();
        });

        this.canvas = null;
        this.state = {
            imageDownloadHref: '',
            imageDownloadName: '',

            // filters
            grayscale: 0,
            contrast: 100,
        };
    };

    componentDidMount() {
        ctx = this.canvas.getContext('2d');
    }

    renderCanvas() {
        if (this.image) {
            console.log('drawImage');
            this.canvas.width = this.image.width;
            this.canvas.height = this.image.height;
            ctx.filter = `
                grayscale(${this.state.grayscale}%)
                contrast(${this.state.contrast}%)
            `;
            ctx.drawImage(this.image, 0, 0);
        }
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
            reader.readAsDataURL(image);
            reader.addEventListener('load', () => {
                this.image.src = reader.result;
                this.image.addEventListener('load', () => this.renderCanvas());
            });
        }
    };

    savePhoto = () => {
        this.setState({
            imageDownloadHref: this.canvas.toDataURL('image/jpeg'),
            imageDownloadName: 'photo-life.jpg'
        });
    };

    setFilter = (filterName, value) => {
        this.setState({[filterName]: value});
        this.renderCanvas();
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
                    <a
                        href={this.state.imageDownloadHref}
                        onClick={this.savePhoto}
                        download={this.state.imageDownloadName}
                    >
                        <span>Save</span>
                    </a>
                </header>
                <aside>
                    <div className='container'>
                        <span>Grayscale</span>
                        <input
                            type='range'
                            value={this.state.grayscale}
                            onChange={event => this.setFilter('grayscale', event.target.value)}
                        />
                        <span>{`${this.state.grayscale}%`}</span>
                        <span>Contrast</span>
                        <input
                            type='range'
                            min='80'
                            max='120'
                            value={this.state.contrast}
                            onChange={event => this.setFilter('contrast', event.target.value)}
                        />
                        <span>{`${this.state.contrast / 100}`}</span>
                    </div>
                </aside>
                <section onDrop={this.drop} onDragOver={this.allowDrop}>
                    <canvas width='400' height='300' ref={canvas => canvas && (this.canvas = canvas)}/>
                </section>
            </React.Fragment>
        );
    }
}