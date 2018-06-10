import React from 'react';
import './styles.less';

export default function Header(props) {
    let {imgExt, handleClick} = props;

    return (
        <header>
            <input
                id='upload-input'
                type='file'
                accept={imgExt}
                onChange={event => {
                    event.preventDefault();
                    this.loadPhoto(event.target.files[0]);
                }}
            />
            <label htmlFor='upload-input'><span>Upload new photo</span></label>
            <button onClick={handleClick}>Save</button>
        </header>
    );
}