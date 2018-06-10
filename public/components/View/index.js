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
        //let image = new Image();
        //image.src = '/img/photo1.jpg';
        //image.addEventListener('load', () => this.renderPhoto(image));

        // Filters collection
        this.filters = {};
        CONSTANTS.filters.forEach(name => this.filters[`${name}Filter`] = new ColorMatrixFilter());
        this.filters.customFilter = new ColorMatrixFilter();

        this.startFiltersState = {
            // input states
            brightness: 100,
            contrast: 0,
            saturate: 0
        };
        this.state = {
            activeSettings: false,
            ...this.startFiltersState
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
        this.stage.removeChild(this.sprite); // clear previous

        let base = new BaseTexture(image);
        let texturePhoto = new Texture(base);
        this.sprite = new Sprite(texturePhoto);

        this.renderer.resize(image.width, image.height);
        this.stage.addChild(this.sprite);
        this.drawStage();

        this.setState({activeSettings: true});
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

    resetPrimaryFilters = () => {
        _.each(this.startFiltersState, (value, key) => this.setPrimaryFilter(key, value));
    };

    render() {
        return (
            <React.Fragment>

                <nav>
                    <img src='./../../img/logo.png' draggable={false}/>
                </nav>

                <Header
                    imgExt={CONSTANTS.imgExt}
                    savePhoto={this.savePhoto}
                    loadPhoto={this.loadPhoto}
                    activeSettings={this.state.activeSettings}
                />

                {this.state.activeSettings && <Aside
                    state={this.state}
                    setPrimaryFilter={this.setPrimaryFilter}
                    setCustomFilter={this.setCustomFilter}
                    customFilters={CONSTANTS.customFilters}
                    resetPrimaryFilters={this.resetPrimaryFilters}
                />}

                <section
                    id='pixi-app'
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