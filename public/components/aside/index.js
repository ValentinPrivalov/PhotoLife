import React from 'react';
import './styles.less';

export default function Aside(props) {
    let {state, setPrimaryFilter, setCustomFilter, customFilters, resetPrimaryFilters} = props;

    return (
        <aside>

            <h2 className='filter-title'>PRIMARY FILTERS</h2>
            <div className='container'>
                <span>Brightness</span>
                <input
                    type='range'
                    min='80'
                    max='120'
                    value={state.brightness}
                    onChange={event => setPrimaryFilter('brightness', event.target.value)}
                />
                <span>{`${state.brightness}%`}</span>

                <span>Contrast</span>
                <input
                    type='range'
                    min='-30'
                    max='30'
                    value={state.contrast}
                    onChange={event => setPrimaryFilter('contrast', event.target.value)}
                />
                <span>{`${state.contrast / 100}`}</span>

                <span>Saturate</span>
                <input
                    type='range'
                    min='-100'
                    max='100'
                    value={state.saturate}
                    onChange={event => setPrimaryFilter('saturate', event.target.value)}
                />
                <span>{`${state.saturate}%`}</span>

                <button onClick={resetPrimaryFilters}>Reset</button>
            </div>

            <h2 className='filter-title'>CUSTOM FILTERS</h2>
            {customFilters.map((name, index) =>
                <div className='filter' key={index} onClick={() => setCustomFilter(name)}>
                    <span className='filter-name'>{name.toUpperCase()}</span>
                    <div id={`filter-${name}`} className='filter-view'>
                        <img src={`/img/filters/${name}.jpg`}/>
                    </div>
                </div>
            )}
        </aside>
    );
}