import React from 'react';
import {PrismCode} from 'react-prism';
import cssbeautify from 'cssbeautify';
import {js_beautify as jsbeautify} from 'js-beautify';
import {components, rawJS, rawCSS} from './components/mapping';
import './wrapper.styl';

const list = Object.keys(components);
const jsbeautifyOptions = {
  e4x: true
};

class Wrapper extends React.Component {
  constructor() {
    super();
    this.state = {
      activeKey: list[0]
    };
  }

  setActive(key) {
    this.setState(() => ({activeKey: key}));
  }

  renderNavItem(key) {
    const isActive = this.state.activeKey === key;
    const className = `nav-item ${isActive ? 'active' : ''}`;
    return (
      <div className={className} key={key} onClick={this.setActive.bind(this, key)}>{key}</div>
    );
  }

  renderComponent(key) {
    const Component = components[key];
    const rawJs = rawJS[key];
    const rawCss = rawCSS[key];
    return (
      <div key={key} className="component cell">
        <div className="section">
          <h2 className="section-title">JSX</h2>
          <pre>
            <PrismCode className="language-javascript">{jsbeautify(rawJs, jsbeautifyOptions)}</PrismCode>
          </pre>
          <div className="sub-section">
            <h2 className="section-title">CSS</h2>
            <pre>
              <PrismCode className="language-css">{cssbeautify(rawCss)}</PrismCode>
            </pre>
          </div>
        </div>
        <div className="section">
          <h2 className="section-title">Result</h2>
          <div className="section-content">
            <Component />
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {activeKey} = this.state;
    return (
      <div className="rc-Wrapper">
        <nav className="nav cell">
          <h1 className="nav-title">Sketch Preview</h1>
          {list.map(key => this.renderNavItem(key))}
        </nav>
        {this.renderComponent(activeKey)}
      </div>
    );
  }
}

export default Wrapper;