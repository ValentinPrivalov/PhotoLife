import React from 'react';
import _ from 'underscore';
import 'pixi.js';

import './styles.less';
import CONSTANTS from './../../constants';

const
    Container = PIXI.Container,
    BaseTexture = PIXI.BaseTexture,
    Texture = PIXI.Texture,
    Sprite = PIXI.Sprite,
    ColorMatrixFilter = PIXI.filters.ColorMatrixFilter;

export default class View extends React.Component {
    constructor() {
        super();

        // previous download
        let image = new Image();
        image.src = '/img/photo1.jpg';
        image.addEventListener('load', () => this.renderPhoto(image));

        // Filters collection
        this.filters = {};
        CONSTANTS.filters.forEach(name => this.filters[`${name}Filter`] = new ColorMatrixFilter());
        this.filters.customFilter = new ColorMatrixFilter();

        this.state = {
            // input states
            brightness: 100,
            contrast: 0,
            saturate: 0
        };
    };

    /**
     * Create PIXI.Application
     */
    componentDidMount() {
        this.renderer = PIXI.autoDetectRenderer(CONSTANTS.baseCanvasSize.width, CONSTANTS.baseCanvasSize.height, {transparent: true});
        this.renderer.view.id = 'photo';
        this.stage = new Container();

        // Bind all filters to stage
        let filters = [];
        _.each(this.filters, filter => filters.push(filter));
        this.stage.filters = filters;

        this.drawStage();
        document.getElementById('pixi-app').appendChild(this.renderer.view);
    }

    drawStage() {
        this.renderer.render(this.stage);
    }

    loadPhoto(imageData) {
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
    }

    renderPhoto(image) {
        this.stage.removeChild(this.sprite); // clear previous

        let base = new BaseTexture(image);
        let texturePhoto = new Texture(base);
        this.sprite = new Sprite(texturePhoto);

        this.renderer.resize(image.width, image.height);
        this.stage.addChild(this.sprite);
        this.drawStage();

        CONSTANTS.customFilters.forEach(name => {
            let renderer = PIXI.autoDetectRenderer(image.width, image.height, {transparent: true});
            renderer.view.id = `filter-${name}-canvas`;

            let sprite = new Sprite(texturePhoto);

            let stage = new Container();
            stage.addChild(sprite);

            let filter = new ColorMatrixFilter();
            stage.filters = [filter];
            filter[name]();

            renderer.render(stage);
            document.getElementById(`filter-${name}`).appendChild(renderer.view);
        });
    }

    savePhoto = () => {
        this.renderer.extract.canvas(this.stage).toBlob(b => {
            let a = document.createElement('a');
            document.body.appendChild(a);
            a.download = CONSTANTS.fileName;
            a.href = URL.createObjectURL(b);
            a.click();
            a.remove();
        });
    };

    setPrimaryFilter(filter, value) {
        this.setState({[filter]: value});
        this.filters[`${filter}Filter`][filter](value / 100);
        this.drawStage();
    }

    setCustomFilter(name) {
        this.filters.customFilter.reset();
        this.filters.customFilter[name](true);
        this.drawStage();
    }

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
                        <span>Brightness</span>
                        <input
                            type='range'
                            min='80'
                            max='120'
                            value={this.state.brightness}
                            onChange={event => this.setPrimaryFilter('brightness', event.target.value)}
                        />
                        <span>{`${this.state.brightness}%`}</span>

                        <span>Contrast</span>
                        <input
                            type='range'
                            min='-30'
                            max='30'
                            value={this.state.contrast}
                            onChange={event => this.setPrimaryFilter('contrast', event.target.value)}
                        />
                        <span>{`${this.state.contrast / 100}`}</span>

                        <span>Saturate</span>
                        <input
                            type='range'
                            min='-100'
                            max='100'
                            value={this.state.saturate}
                            onChange={event => this.setPrimaryFilter('saturate', event.target.value)}
                        />
                        <span>{`${this.state.saturate}%`}</span>
                    </div>
                </aside>

                <section
                    id='pixi-app'
                    onDrop={event => {
                        event.preventDefault();
                        this.loadPhoto(event.dataTransfer.files[0]);
                    }}
                    onDragOver={event => event.preventDefault()}
                />

                <footer>
                    {CONSTANTS.customFilters.map((name, index) =>
                        <div className='filter' key={index} onClick={() => this.setCustomFilter(name)}>
                            <span className='filter-name'>{name.toUpperCase()}</span>
                            <div id={`filter-${name}`} className='filter-view'/>
                        </div>
                    )}
                </footer>

            </React.Fragment>
        );
    }
}