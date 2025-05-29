import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import {bg,fg, bird0, bird1, bird2, pipeN, pipeS, gameover, _ok_, splash, ready, tap, menu} from './common/Sprite';
import {width, height} from './common/common';
import { observer} from 'mobx-react';
import {rungame, states} from './store/store';
import startBtn from './res/start.png';
import zero from './res/numbers/zero.png';
import one from './res/numbers/one.png';
import two from './res/numbers/two.png';
import three from './res/numbers/three.png';
import four from './res/numbers/four.png';
import five from './res/numbers/five.png';
import six from './res/numbers/six.png';
import seven from './res/numbers/seven.png';
import eight from './res/numbers/eight.png';
import nine from './res/numbers/nine.png';
import menuBtn from './res/menu.png';
//ITs sucode

const SpriteWrapper = observer(class SpriteWrapper extends Component {

  render = () => {
    const gameSprite = this.props.gameSprite;
    const rotate = 'rotate('+ gameSprite.rotation +'rad)'
    const translate = 'translate(' + gameSprite.cx + 'px,' + gameSprite.cy + 'px)'
    const ctrans = (gameSprite.rotation == null) ? translate : translate + ' ' + rotate;
    const onClickHandler = (this.props.onClickHandler) == null ? null : this.props.onClickHandler;
    var style = {
      transform: ctrans,
      position: 'absolute'
    }

    return (
      <div style={style} onClick={onClickHandler}>
        {this.props.children}
      </div>)
  }
})

const Bg = observer(
  class Bg extends Component {
  render = () => {
      return <SpriteWrapper gameSprite={this.props.bg}> {bg} </SpriteWrapper>;
  }

})

const Fg = observer(
  class Fg extends Component {
  render = () => {
      return <SpriteWrapper gameSprite={this.props.fg}> {fg} </SpriteWrapper>;
  }

})

export const Bird = observer(
   class Bird extends Component {

      render = () => {
          let wbird;
          switch(this.props.bird.frame) {
            case 1:
            case 3:
              wbird = bird1
              break
            case 2:
              wbird = bird2
              break
            case 0:
            default:
              wbird = bird0
              break
          }

          return <SpriteWrapper gameSprite={this.props.bird}> {wbird} </SpriteWrapper>;
      }
   }
)

const Pipe = observer(
  class Pipe extends Component {
  render = () => {
    let wpipe;
    switch(this.props.pipe.type) {
      default:
      case "N":
        wpipe = pipeN
        break
      case "S":
        wpipe = pipeS
        break
    }

    return <SpriteWrapper gameSprite={this.props.pipe}> {wpipe} </SpriteWrapper>;

  }
})

const Gameover = observer(
  class Gameover extends Component {

  render = () => {
      return <SpriteWrapper gameSprite={{cx: width/2 - 94, cy: height-400}}> {gameover} </SpriteWrapper>;
  }

})

export const OK = observer(
  class OK extends Component {
    render = () => {
      return (
        <div className="ok-button-absolute" onClick={rungame}>
          {_ok_}
        </div>
      );
    }
  }
);

export const Splash = observer(
  class Splash extends Component {

  render = () => {
      return <SpriteWrapper gameSprite={{cx: width/2 - 59, cy: height-300}}> {splash} </SpriteWrapper>;
  }

})

const StartButton = () => (
  <div style={{
    marginTop: 220,
    marginLeft:220,
    display: 'flex',
    justifyContent: 'center',
    pointerEvents: 'auto',
    cursor: 'pointer',
  }}
    onClick={rungame}
  >
    <img src={startBtn} alt="Start" style={{width: 80, height: 'auto'}} />
  </div>
);

export const ReadyAndTap = observer(
  class ReadyAndTap extends Component {
    render = () => {
      return (
        <div style={{
          position: 'absolute',
          left: '22%',
          top: '45%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pointerEvents: 'none',
          zIndex: 5
        }}>
          <SpriteWrapper gameSprite={{cx: 400/2 - 87, cy: -40}}>{ready}</SpriteWrapper>
          <div style={{height: 16}} />
          <SpriteWrapper gameSprite={{cx: 400/2 - 89.25, cy: 20}}>{tap}</SpriteWrapper>
          <StartButton />
        </div>
      );
    }
  }
);

const ScoreDisplay = observer(({ score }) => {
  const digits = String(score).split('').map(Number);
  const numberImages = [zero, one, two, three, four, five, six, seven, eight, nine];
  
  return (
    <div style={{
      position: 'absolute',
      top: 20,
      right: 20,
      zIndex: 9999,
      background: 'transparent',
      pointerEvents: 'none',
      filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.5))'
    }}>
      {digits.map((d, i) => (
        <img 
          key={i} 
          src={numberImages[d]} 
          alt={d.toString()} 
          style={{
            width: '24px',
            height: '36px',
            marginLeft: i === 0 ? 0 : '2px'
          }}
        />
      ))}
    </div>
  );
});

const MenuButton = observer(() => {
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 9999,
      cursor: 'pointer',
      pointerEvents: 'auto',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop:-300,
      marginLeft:-150,
    }}>
      {menu}
    </div>
  );
});


const App = observer(class App extends Component {
  componentDidMount() {

    this.req = window.requestAnimationFrame(this.appUpdateFrame)

  }

  //Call to store to update the frame
  appUpdateFrame = () => {

    this.props.updateFrame(); //this will trigger mobx to update the view when observable value change

    this.req = window.requestAnimationFrame(this.appUpdateFrame) //rerun this function again when browser is ready to update new frame

  }

  render() {
    const {bgs, fgs, bird, pipes} = this.props.store
    const { currentstate } = this.props.game;

    return (
      <div className="canvas-wrapper">
        <div className="game-title">Flappy Bird</div>
        <div style={{ position: "relative", width: 400, height: 618 }}>
          <div className="App" id="fakingcanvas">
            {bgs.map(bg => <Bg bg={bg} key={bg.id} />)}
            {pipes.map(pipe => <Pipe pipe={pipe} key={pipe.id} />)}
            <Bird bird={bird} />
            {currentstate === states.Splash && <Splash />}
            {currentstate === states.Splash && <ReadyAndTap />}
            {fgs.map(fg => <Fg fg={fg} key={fg.id} />)}
          </div>
          {currentstate === states.Score && (
            <div className="gameover-ok-container">
              <div className="gameover-image">{gameover}</div>
              <div className="ok-button" onClick={rungame}>{_ok_}</div>
            </div>
          )}
        </div>
      </div>
    );
  }
});

export default App;

