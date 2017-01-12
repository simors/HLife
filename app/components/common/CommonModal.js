/**
 * Created by zachary on 2016/12/21.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  ListView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Platform,
  InteractionManager,
  Modal
} from 'react-native'

import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'

export default class CommonModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      animationType : this.props.animationType?this.props.animationType:'slide',
      transparent : true,
      visible : false
    }
  }

  componentWillReceiveProps(newProps) {
    if (this.props.modalVisible != newProps.modalVisible) {
      this.setState({visible: newProps.modalVisible})
    }
  }

  componentDidMount() {
    this.setState({visible: !!this.props.modalVisible})
  }

  render() {
    let modalBackgroundStyle ={
      backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : '#000',
    }
    return (
      <Modal
        animationType={this.state.animationType}
        transparent={this.state.transparent}
        visible={this.state.visible}
        onRequestClose={()=>{}}
      >
        <View style={[styles.container, modalBackgroundStyle, this.props.containerStyle]}>
          <View style={styles.modalCntTitleWrap}>
            <Text style={styles.modalCntTitle}>{this.props.modalTitle}</Text>
          </View>
          <View style={[styles.modalContent, this.props.modalContentStyle]}>
            {this.props.children}
          </View>
          <View style={styles.modalCntBottomWrap}>
            <TouchableWithoutFeedback
              onPress={() => {this.props.closeModal()}}
            >
              <Image source={require("../../assets/images/shop_close.png")}/>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      ios: {
        paddingTop: normalizeH(100),
      },
      android: {
        paddingTop: normalizeH(80)
      }
    }),
  },
  modalCntTitleWrap: {
    height: normalizeH(67),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: normalizeBorder(),
    borderBottomColor:THEME.colors.lighterA
  },
  modalCntTitle: {
    fontSize: em(18),
    color: '#030303'
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#fff'
  },
  modalCntBottomWrap: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: normalizeBorder(),
    borderTopColor:THEME.colors.lighterA
  },
})