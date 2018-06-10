import React from 'react';
import _ from 'underscore';
import 'pixi.js';

import './styles.less';
import CONSTANTS from './../../constants';

import Header from './../header/index';
import Aside from './../aside/index';

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
            let scale = CONSTANTS.exampleCanvasScale;

            let renderer = new PIXI.CanvasRenderer(image.width * scale, image.height * scale, {transparent: true});
            renderer.view.id = `filter-${name}-canvas`;

            let sprite = new Sprite(texturePhoto);
            sprite.scale.x = sprite.scale.y = scale;

            let stage = new Container();
            stage.addChild(sprite);

            let filter = new ColorMatrixFilter();
            stage.filters = [filter];
            filter[name]();

            renderer.render(stage);

            let node = document.getElementById(`filter-${name}`);
            while (node.hasChildNodes()) {
                node.removeChild(node.lastChild);
            }
            node.appendChild(renderer.view);
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

    setPrimaryFilter = (filter, value) => {
        this.setState({[filter]: value});
        this.filters[`${filter}Filter`][filter](value / 100);
        this.drawStage();
    };

    setCustomFilter = name => {
        this.filters.customFilter.reset();
        this.filters.customFilter[name](true);
        this.drawStage();
    };

    render() {
        return (
            <React.Fragment>

                <nav>
                    <img src='./../../img/logo.png' draggable={false}/>
                </nav>

                <Header imgExt={CONSTANTS.imgExt} handleClick={this.savePhoto}/>

                <Aside state={this.state} handleChange={this.setPrimaryFilter}/>

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