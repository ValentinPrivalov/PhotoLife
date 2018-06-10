import React from 'react';
import './styles.less';

export default function Header(props) {
    let {imgExt, savePhoto, loadPhoto, activeSettings} = props;

    return (
        <header>
            <input
                id='upload-input'
                type='file'
                accept={imgExt}
                onChange={event => {
                    event.preventDefault();
                    loadPhoto(event.target.files[0]);
                }}
            />
            <label htmlFor='upload-input'><span>Upload new photo</span></label>
            {activeSettings && <button onClick={savePhoto}>Save</button>}
        </header>
    );
}