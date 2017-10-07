import './App.css'
import {Howl} from 'howler'
import React, { Component } from 'react'

const SLOW_RATE = 0.7
const FAST_RATE = 1.6

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      rate: 1,
      websocketConnected: false
    }
  }

  componentDidMount () {
    this.onButtonPressDown = this.onButtonPressDown.bind(this)
    this.onClickFace = this.onClickFace.bind(this)

    this.socket = new WebSocket('ws://localhost:3000')
    this.socket.onopen = () => {
      this.setState({websocketConnected: true})
    }
    this.socket.onmessage = this.onWebsocketMessage.bind(this)
  }

  onWebsocketMessage (message) {
    var packet = JSON.parse(message.data)
    if (packet.name === 'buttonDown') {
      let buttonNumber = packet.buttonNum + (packet.deviceNum * 50)
      let button = this.refs[`button${buttonNumber}`]
      if (button) {
        button.mouseDown()
      }
    }
  }

  onButtonPressDown () {
    this.refs.faceBottom.classList.add('down')
    setTimeout(() => {
      this.refs.faceBottom.classList.remove('down')
    }, 300)
  }

  onClickFace () {
    let buttonNumber = randomInt(1, 98)
    let button = this.refs[`button${buttonNumber}`]
    if (button) {
      button.mouseDown()
    }
  }

  render () {
    return (
      <div className='App'>
        <header className='App-header'>
          <img className={'title'} id='title' src='images/title.png' />
          <div className={'face-container'} onClick={this.onClickFace.bind(this)}>
            <div className={'face-circle'}>
              <img className={'face-top'} id='face' src='images/lr4_top.gif' />
              <img className={'face-bottom'} ref={'faceBottom'} id='face' src='images/lr4_bottom.gif' />
            </div>
          </div>
          <a href='http://buttonsare.cool/'>
            <img className={'thousand'} id='thousand' src='images/thousand.png' />
          </a>
        </header>
        <div>
          {[...Array(98)].map((_, index) => {
            index = index + 1
            return (
              <Button
                key={index}
                id={index}
                rate={this.state.rate}
                ref={`button${index}`}
                onPressDown={this.onButtonPressDown.bind(this)}
              />
            )
          })}
          <hr />
          <ModifierButton
            id={99}
            title={'SLOW'}
            onPressDown={() => this.setState({rate: this.state.rate === SLOW_RATE ? 1 : SLOW_RATE})}
          />
          <ModifierButton
            id={100}
            title={'FAST'}
            onPressDown={() => this.setState({rate: this.state.rate === FAST_RATE ? 1 : FAST_RATE})}
          />
        </div>
        <footer className='App-footer'>
          Made by <a href='https://twitter.com/nickwarner'>@nickwarner!</a> Thanks to <a href='https://www.instagram.com/lindsayrall/'>@lindsayrall</a> for playing along and <a href='https://twitter.com/mildmojo'>@mildmojo</a> for making the great #1000ButtonProject server and <a href='https://twitter.com/barelyconcealed'>@barelyconcealed</a> for making a crazy video game controller.
        </footer>
      </div>
    )
  }
}

class Button extends Component {
  constructor (props) {
    super(props)
    this.soundId = 101 - this.props.id // Reverse sounds
    this.imageId = randomInt(1, 5)
    this.src = `images/lr${this.imageId}.gif`
    if (this.props.id === 8) {
      this.src = 'images/wallie.gif'
    }
    this.playSound = this.playSound.bind(this)
  }

  mouseDown () {
    this.refs.button.click()
  }

  playSound () {
    new Howl({
      src: [`sounds/${this.soundId}.mp3`],
      autoplay: true,
      volume: 1,
      rate: this.props.rate
    })
    this.refs.image.classList.add('grow')
    setTimeout(() => {
      this.refs.image.classList.remove('grow')
    }, 300)
    this.props.onPressDown()
  }

  render () {
    return (
      <button className={'button'} ref={'button'} onClick={this.playSound}>
        <img src={this.src} ref={'image'} className={'buttonImage'} />
      </button>
    )
  }
}

class ModifierButton extends Component {
  constructor (props) {
    super(props)
    this.onPressDown = this.onPressDown.bind(this)
    this.onPressUp = this.onPressUp.bind(this)
  }

  onPressDown () {
    this.props.onPressDown()
    this.refs.button.classList.add('on')
  }

  onPressUp () {
    // this.props.onPressUp()
    this.refs.button.classList.remove('on')
  }

  render () {
    return (
      <button
        className={'button'}
        onMouseDown={this.onPressDown}
        onMouseUp={this.onPressUp}
        ref={'button'}
        >
        {this.props.title}
      </button>
    )
  }
}

export default App
