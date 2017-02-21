/**
 * Created by zachary on 2017/2/18.
 */
import React, {
  Component,
} from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator
} from 'react-native';

let styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

class LoadingContainer extends Component {

  constructor() {
    super(...arguments)
  }

  componentDidMount = () => {
    this._show()
  }

  componentWillUnmount = () => {
    //this._hide()
  }

  _show = () => {
    this.props.onShown && this.props.onShown(this.props.siblingManager)
  }

  _hide = () => {
    this.props.onHidden && this.props.onHidden(this.props.siblingManager)
  }

  render() {
    return(
      <View style={styles.container}>
        <ActivityIndicator
          animating={true}
          size="small"
          color={'#C8C8C8'}
        />
      </View>
    )
  }
}

export default LoadingContainer

