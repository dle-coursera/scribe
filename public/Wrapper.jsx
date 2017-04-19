import React from 'react';
import {PrismCode} from 'react-prism';
import cssbeautify from 'cssbeautify';
import {js_beautify as jsbeautify} from 'js-beautify';
import mapping from './components/mapping';
import './wrapper.styl';

const jsbeautifyOptions = {
  e4x: true
};

class Wrapper extends React.Component {
  constructor() {
    super();

    const firstProject = Object.keys(mapping)[0];
    const firstComponent = Object.keys(mapping[firstProject])[0];
    this.state = {
      activeProject: firstProject,
      activeComponent: firstComponent
    };
  }

  setActive(activeProject, activeComponent) {
    this.setState(() => ({activeProject, activeComponent}));
  }

  renderNavGroup(projectName) {
    const project = mapping[projectName];
    return (
      <div className="nav-project" key={projectName}>
        <h2 className="nav-project-title">{projectName}</h2>
        {Object.keys(project).map(
          componentName => this.renderNavItem(projectName, componentName)
        )}
      </div>
    );
  }

  renderNavItem(projectName, componentName) {
    const {activeProject, activeComponent} = this.state;
    const isActive = activeProject === projectName && activeComponent === componentName;
    const className = `nav-item ${isActive ? 'active' : ''}`;
    return (
      <div
        className={className}
        key={`${projectName}-${componentName}`}
        onClick={this.setActive.bind(this, projectName, componentName)}
      >
        {componentName}
      </div>
    );
  }

  renderComponent(projectName, componentName) {
    const {ReactComponent, rawJS, rawCSS} = mapping[projectName][componentName];
    return (
      <div key={`${projectName}-${componentName}`} className="component cell">
        <div className="section">
          <h2 className="section-title">JSX</h2>
          <pre>
            <PrismCode className="language-javascript">{jsbeautify(rawJS, jsbeautifyOptions)}</PrismCode>
          </pre>
          <div className="sub-section">
            <h2 className="section-title">CSS</h2>
            <pre>
              <PrismCode className="language-css">{cssbeautify(rawCSS)}</PrismCode>
            </pre>
          </div>
        </div>
        <div className="section">
          <h2 className="section-title">Result</h2>
          <div className="section-content">
            <ReactComponent />
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {activeProject, activeComponent} = this.state;
    return (
      <div className="rc-Wrapper">
        <nav className="nav cell">
          <h1 className="nav-title">Sketch Preview</h1>
          {Object.keys(mapping).map(project => this.renderNavGroup(project))}
        </nav>
        {this.renderComponent(activeProject, activeComponent)}
      </div>
    );
  }
}

export default Wrapper;