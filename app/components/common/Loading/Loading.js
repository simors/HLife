/**
 * Created by zachary on 2017/2/18.
 */
import React, {
  Component,
  PropTypes
} from 'react';
import {
  View,
  ActivityIndicator
} from 'react-native';
import RootSiblings from 'react-native-root-siblings';
import LoadingContainer from './LoadingContainer';

class Loading extends Component {

  static show = (options) => {
    return new RootSiblings(
      <LoadingContainer
        {...options}
      />
    )
  }

  static hide = (loading, callback) => {
    if (loading instanceof RootSiblings) {
      loading.destroy();
    } else {
      console.warn(`Loading.hide expected a \`RootSiblings\` instance as argument.\nBut got \`${typeof loading}\` instead.`);
    }
  }

  _loading = null

  componentWillMount = () => {
    this._loading = new RootSiblings(<LoadingContainer
      {...this.props}
    />)
  }

  componentWillReceiveProps = nextProps => {
    this._loading.update(<LoadingContainer
      {...nextProps}
    />)
  }

  componentWillUnmount = () => {
    this._loading.destroy()
  }

  render() {
    return null
  }
}

export {
  RootSiblings as Manager
};
export default Loading
