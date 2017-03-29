import React, { PropTypes } from 'react'
import { Button, View, Text, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    paddingTop: 40
  },
  text: {
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 20
  }
})

const ModalView = ({ onClose }) => (
  <View style={{ flex: 1 }}>
    <View style={styles.inner}>
      <Text style={styles.text}>
        Här kommer text sen
      </Text>
    </View>
    <Button
      title="STÄNG"
      onPress={() => onClose()}
    />
  </View>
)

ModalView.propTypes = {
  onClose: PropTypes.func.isRequired
}

export default ModalView
