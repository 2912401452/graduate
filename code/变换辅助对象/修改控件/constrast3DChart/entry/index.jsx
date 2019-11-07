import React from 'react';
import { render } from 'react-dom';

import { Constrast3DChart } from '../index.jsx';
import { config } from '../js/config.js';

const reactContentWrap = document.createElement('div');
reactContentWrap.className = 'easyV-component';
document.body.appendChild(reactContentWrap);

render(<Constrast3DChart configuration={config.configuration} />, reactContentWrap);
