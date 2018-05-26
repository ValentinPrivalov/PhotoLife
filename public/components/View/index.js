import React from 'react';
import 'pixi.js';
import './styles.less';
import CONSTANTS from './../../constants';

export default class View extends React.Component {
    constructor() {
        super();

        // previous download
        let image = new Image();
        image.src = '/img/photo1.jpg';
        image.addEventListener('load', () => this.renderPhoto(image));

        this.state = {
            // filters
            grayscale: 0,
            contrast: 100,
        };
    };

    /**
     * Create PIXI.Application
     */
    componentDidMount() {
        this.renderer = PIXI.autoDetectRenderer(CONSTANTS.baseCanvasSize.width, CONSTANTS.baseCanvasSize.height);
        this.renderer.view.id = 'photo';
        this.stage = new PIXI.Container();
        this.drawStage();

        document.getElementById('image').appendChild(this.renderer.view);
    }

    drawStage() {
        this.renderer.render(this.stage);
    }

    loadPhoto = imageData => {
        // FileReader support
        if (FileReader && imageData) {
            let reader = new FileReader();
            reader.readAsDataURL(imageData);
            reader.addEventListener('load', () => {
                let image = new Image();
                image.src = reader.result;
                image.addEventListener('load', () => this.renderPhoto(image));
            });
        }
    };

    renderPhoto(image) {
        this.stage.removeChild(this.sprite); // clear

        let base = new PIXI.BaseTexture(image);
        let texturePhoto = new PIXI.Texture(base);
        this.sprite = new PIXI.Sprite(texturePhoto);

        this.renderer.resize(image.width, image.height);
        this.stage.addChild(this.sprite);
        this.drawStage();
    }

    savePhoto = () => {
        this.renderer.extract.canvas(this.sprite).toBlob(b => {
            let a = document.createElement('a');
            document.body.appendChild(a);
            a.download = CONSTANTS.fileName;
            a.href = URL.createObjectURL(b);
            a.click();
            a.remove();
        });
    };

    setFilter = (filterName, value) => {
        this.setState({[filterName]: value});
    };

    render() {
        return (
            <React.Fragment>

                <nav>
                    <img src='./../../img/logo.png' draggable={false}/>
                </nav>

                <header>
                    <input
                        id='upload-input'
                        type='file'
                        accept={CONSTANTS.imgExt}
                        onChange={event => {
                            event.preventDefault();
                            this.loadPhoto(event.target.files[0]);
                        }}
                    />
                    <label htmlFor='upload-input'><span>Upload new photo</span></label>
                    <button onClick={this.savePhoto}>Save</button>
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

                <section
                    id='image'
                    onDrop={event => {
                        event.preventDefault();
                        this.loadPhoto(event.dataTransfer.files[0]);
                    }}
                    onDragOver={event => event.preventDefault()}
                />

            </React.Fragment>
        );
    }
}