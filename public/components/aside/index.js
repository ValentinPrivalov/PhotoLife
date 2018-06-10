import React from 'react';
import './styles.less';

export default function Aside(props) {
    let {state, handleChange} = props;

    return (
        <aside>
            <div className='container'>
                <span>Brightness</span>
                <input
                    type='range'
                    min='80'
                    max='120'
                    value={state.brightness}
                    onChange={event => handleChange('brightness', event.target.value)}
                />
                <span>{`${state.brightness}%`}</span>

                <span>Contrast</span>
                <input
                    type='range'
                    min='-30'
                    max='30'
                    value={state.contrast}
                    onChange={event => handleChange('contrast', event.target.value)}
                />
                <span>{`${state.contrast / 100}`}</span>

                <span>Saturate</span>
                <input
                    type='range'
                    min='-100'
                    max='100'
                    value={state.saturate}
                    onChange={event => handleChange('saturate', event.target.value)}
                />
                <span>{`${state.saturate}%`}</span>
            </div>
        </aside>
    );
}