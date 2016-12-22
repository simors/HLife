/**
 * Created by yangyang on 2016/12/22.
 */
import React from 'react';
import {
  View,
  StyleSheet
} from 'react-native';

import CustomAvatar from './CustomAvatar';
import CustomBubble from './CustomBubble';
import CustomDay from './CustomDay';
import CustomNameView from './CustomNameView'

import { isSameUser, isSameDay, warnDeprecated } from './GifedChat/utils';

export default class CustomMessage extends React.Component {

  renderDay() {
    if (this.props.currentMessage.createdAt) {
      const {containerStyle, ...dayProps} = this.props;
      if (this.props.renderDay) {
        return this.props.renderDay({
          ...dayProps,
          //TODO: remove in next major release
          isSameUser: warnDeprecated(isSameUser),
          isSameDay: warnDeprecated(isSameDay)
        });
      }
      return <CustomDay {...dayProps}/>;
    }
    return null;
  }

  renderNameView() {
    const nameViewProps = {
      ...this.props,
      isSameUser: warnDeprecated(isSameUser),
      isSameDay: warnDeprecated(isSameDay)
    }
    return (
      <CustomNameView {...nameViewProps}/>
    )
  }

  renderBubble() {
    const {containerStyle, ...bubbleProps} = this.props;
    if (this.props.renderBubble) {
      return this.props.renderBubble({
        ...bubbleProps,
        //TODO: remove in next major release
        isSameUser: warnDeprecated(isSameUser),
        isSameDay: warnDeprecated(isSameDay)
      });
    }
    return <CustomBubble {...bubbleProps}/>;
  }

  renderAvatar() {

    const {containerStyle, ...other} = this.props;
    const avatarProps = {
      ...other,
      //TODO: remove in next major release
      isSameUser: warnDeprecated(isSameUser),
      isSameDay: warnDeprecated(isSameDay)
    };
    return <CustomAvatar {...avatarProps}/>;

  }

  render() {
    return (
      <View>
        {this.renderDay()}
        {this.renderNameView()}
        <View style={[styles[this.props.position].container, {
          marginBottom: isSameUser(this.props.currentMessage, this.props.nextMessage) ? 10 : 20,
        }, this.props.containerStyle[this.props.position]]}>
          {this.props.position === 'left' ? this.renderAvatar() : null}
          {this.renderBubble()}
          {this.props.position === 'right' ? this.renderAvatar() : null}
        </View>
      </View>
    );
  }
}

const styles = {
  left: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      marginLeft: 8,
      marginRight: 0,
    },
  }),
  right: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'flex-end',
      marginLeft: 0,
      marginRight: 8,
    },
  }),
};

CustomMessage.defaultProps = {
  renderAvatar: null,
  renderBubble: null,
  renderDay: null,
  position: 'left',
  currentMessage: {},
  nextMessage: {},
  previousMessage: {},
  user: {},
  containerStyle: {},
};

CustomMessage.propTypes = {
  renderAvatar: React.PropTypes.func,
  renderBubble: React.PropTypes.func,
  renderDay: React.PropTypes.func,
  position: React.PropTypes.oneOf(['left', 'right']),
  currentMessage: React.PropTypes.object,
  nextMessage: React.PropTypes.object,
  previousMessage: React.PropTypes.object,
  user: React.PropTypes.object,
  containerStyle: React.PropTypes.shape({
    left: View.propTypes.style,
    right: View.propTypes.style,
  }),
};
