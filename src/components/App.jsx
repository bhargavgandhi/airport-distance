import React, {Component} from 'react';
import '../styles/style.css';
import airportLists from '../utils/';
import logo from '../images/logo.svg';
import mapFrom from '../images/map-from.svg';
import mapTo from '../images/map-to.svg';
import mapDistance from '../images/map-distance.png';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      airportData: airportLists,
    };
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <nav>
            <div className="container">
              <h1 id="airLogo">
                Airport Distance
              </h1>
            </div>
          </nav>
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <section className="container">
          <section className="clearfx"></section>
          <section className="row">
            <article className="main">
              <header>
                Find distance between airports in US. Measures in Nautical Miles.
              </header>
              <input id="airFrom" name="airFrom" type="text" placeholder="From" className="awesomplete" autoComplete="off" required="required" />
              <input id="airTo" name="airTo" type="text" placeholder="To" className="awesomplete" autoComplete="off" required="required" />
              <button id="airMeasureBtn" className="airBtn">
                Measure
              </button>
            </article>
          </section>
          <section className="clearfx"></section>
          <section className="row">
            <article id="mainDetails">
              <h2>
                <img src={mapFrom} alt="Map icon from"/>
                From:
                <span id="distanceFrom"></span>
              </h2>

              <h2>
                <img src={mapTo} alt="Map icon"/>
                To:
                <span id="distanceTo"></span>
              </h2>

              <h3>
                <img src={mapDistance} alt="Map distance icon"/>
                Distance in Nautical Miles:
                <span id="totDistance"></span>
              </h3>
            </article>
          </section>

          <section className="clearfx"></section>
          <section id="gmapSection" className="row">
            <article id="gmap"></article>
          </section>

          <footer>
            <p className="copyrightTxt">
              Developed by
              <a href="http://www.bhargavgandhi.com/" target="_blank" rel="noopener noreferrer">Bhargav Gandhi</a>
            </p>
          </footer>
        </section>
      </div>
    );
  }
}

export default App;
