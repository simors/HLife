/**
 * Created by yangyang on 2016/12/30.
 */
import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Modal
} from 'react-native';
import Gallery from 'react-native-gallery'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export default class MessageImage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      imgModalShow: false,
    }
  }

  toggleModal(isShow) {
    this.setState({imgModalShow: isShow})
  }

  renderImageModal(src) {
    return (
      <View>
        <Modal visible={this.state.imgModalShow} transparent={false} animationType='fade'>
          <View style={{width: PAGE_WIDTH, height: PAGE_HEIGHT}}>
            <Gallery
              style={{flex: 1, backgroundColor: 'black'}}
              images={[src]}
              onSingleTapConfirmed={() => this.toggleModal(!this.state.imgModalShow)}
            />
          </View>
        </Modal>
      </View>
    )
  }

  render() {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        {this.renderImageModal(this.props.currentMessage.image)}
        <TouchableOpacity style={{flex: 1}} onPress={() => this.toggleModal(!this.state.imgModalShow)}>
          <Image
            style={[styles.image, this.props.imageStyle]}
            source={{uri: this.props.currentMessage.image}}
          />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
  },
  image: {
    width: 150,
    height: 100,
    borderRadius: 5,
    margin: 3,
    resizeMode: 'cover',
  },
});

MessageImage.defaultProps = {
  currentMessage: {
    image: null,
  },
  containerStyle: {},
  imageStyle: {},
};

MessageImage.propTypes = {
  currentMessage: React.PropTypes.object,
  containerStyle: View.propTypes.style,
  imageStyle: Image.propTypes.style,
};
