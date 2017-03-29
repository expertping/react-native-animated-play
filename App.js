import React, { Component } from 'react';
import { Animated, Easing, Button, StyleSheet, Text, View, Dimensions, PanResponder } from 'react-native';

import AnimatedModal from './AnimatedModal';
import ModalView from './ModalView';

import styles from './styles'
const deviceHeight = Dimensions.get('window').height

export default class App extends Component {
  state = {
    modal: new Animated.ValueXY({ x: 0, y: 400 })
  }

  animateModal = (open) => {
    Animated.timing(
      this.state.modal,
      {
        toValue: open ? 0 : 400,
        easing: Easing.inOut(Easing.sin)
      }
    ).start()
  }

  showModal = () => {
    this.animateModal(true)
  }

  closeModal = () => {
    this.animateModal(false)
  }

  allowedToMove = (evt, gestureState) => {
    if (gestureState.dy < 0) {
      return false
    }
    return true
  }

  componentWillMount() {
    this._animatedValueY = 0;
    this.state.modal.y.addListener((value) => this._animatedValueY = value.value);
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: (evt, gestureState) => this.allowedToMove(evt, gestureState),
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => this.allowedToMove(evt, gestureState),
      onPanResponderGrant: (e, gestureState) => {
        this.state.modal.setOffset({ y: this._animatedValueY });
        this.state.modal.setValue({ x: 0, y: 0 }); //Initial value
      },
      onPanResponderMove: Animated.event([
        null,
        { dx: 0, dy: this.state.modal.y }
      ]),
      onPanResponderRelease: () => {
        const y = this.state.modal.y._value
        if (y > 200) {
          this.closeModal()
        } else {
          Animated.spring(this.state.modal, {
            toValue: 0
          }).start();
        }
      }
    });
  }

  componentWillUnmount() {
    this.state.pan.y.removeAllListeners();
  }

  render() {
    const transformScale = this.state.modal.y.interpolate({
      inputRange: [0, 400],
      outputRange: [0.9, 1],
      extrapolate: 'clamp'
    })

    const tapSuprresorPosition = this.state.modal.y.interpolate({
      inputRange: [0, 400],
      outputRange: [-deviceHeight, 0],
      extrapolate: 'clamp'
    })

    const menuPosition = this.state.modal.y.interpolate({
      inputRange: [0, 400],
      outputRange: [400, 0],
      extrapolate: 'clamp'
    })

    const opacity = this.state.modal.y.interpolate({
      inputRange: [0, 400],
      outputRange: [1, 0],
      extrapolate: 'clamp'
    })


    return (
      <Animated.View style={styles.container}>
        <Animated.View style={{
          height: '100%',
          width: '100%',
          paddingTop: 100,
          backgroundColor: '#000',
          transform: [{ scale: transformScale }]
        }}>
          <Button title="ÖPPNA" onPress={() => this.showModal()} />
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          style={[
            styles.backdrop,
            { opacity }
          ]}
        />

        <Animated.View
          onStartShouldSetResponder={() => this.closeModal()}
          style={{ backgroundColor: 'transparent', height: deviceHeight, width: '100%', transform: [{ translateY: tapSuprresorPosition }] }}
        />

        <AnimatedModal height={400} position={this.state.modal.y} {...this._panResponder.panHandlers}>
          <ModalView onClose={this.closeModal} />
        </AnimatedModal>
      </Animated.View>
    );
  }
}
