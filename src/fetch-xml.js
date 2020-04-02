/*
Current Issue :
Request tiap provinsi diubah
*/

import React from 'react';

export function Select(props) {
    const optionList = props.optionList;
    const defaultValue = props.defaultValue;
    const defaultText = props.defaultText;

    return (
        <div className="dropdown">
            <select onChange={props.onChange}>
                {defaultValue && <option defaultValue={defaultValue}>{defaultText}</option>}
                {optionList.map(element =>
                    <option key={element.name} value={element.name}>
                        {element.value}
                    </option>
                )}
            </select>
        </div>
    )
}


