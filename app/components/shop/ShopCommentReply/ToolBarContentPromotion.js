/**
 * Created by lilu on 2017/8/24.
 */
/**
 * Created by zachary on 2017/1/3.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Platform,
  TextInput,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native'

import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import THEME from '../../../constants/themes/theme1'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export default class ToolBarContentPromotion extends Component {

  static defaultProps = {
    placeholder: '回复:',
    multiline: true
  }

  constructor(props) {
    super(props)

    this.state = {
      content: '',
      height: 50,
    }
  }

  onSend() {
    this.props.onSend(this.state.content)
    if (this.input) {
      this.input.setNativeProps({text: ''})
    }
  }

  onChangeText(text) {
    this.setState({
      content: text
    })
  }

  refFunc(input) {
    this.input = input
    this.props.replyInputRefCallBack(input)
  }

  _onChange(event) {
    // const textInputContentHeight = event.nativeEvent.contentSize.height
    // if(textInputContentHeight < 80) {
    //   this.setState({
    //     height: textInputContentHeight,
    //   })
    // }

    if (this.props.onChange) {
      this.props.onChange(event)
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {/*<Text style={styles.setPriceText}>设置活动价格:</Text>*/}
        <View style={styles.priceBox}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[styles.priceTitle]}>¥</Text>
            <TextInput
              ref={(input) => {
                this.refFunc(input)
              }}
              placeholder='设置活动价格'
              placeholderTextColor={[styles.priceText, {color: '#B2B2B2'}]}
              multiline={false}
              numberOfLines={this.props.numberOfLines || 1}
              onChange={this._onChange.bind(this)}
              onChangeText={this.onChangeText.bind(this)}
              style={[styles.priceText, this.props.textInputStyle]}
              value={this.props.initValue}
              enablesReturnKeyAutomatically={true}
              underlineColorAndroid="transparent"
              keyboardType={this.props.keyboardType || 'default'}
              maxLength={10}
              {...this.props.textInputProps}
            />
            <Text style={[styles.priceTitle]}>元</Text>
          </View>
          <Text style={styles.originalPriceText}>{'原价' + this.props.price + '元'}</Text>
        </View>

        <TouchableOpacity
          style={[styles.btnContainer, this.props.btnContainerStyle]}
          onPress={() => {
            this.onSend()
          }}
        >
          <Text style={[styles.btnText, this.props.btnTextStyle]}>{this.props.label || '发表'}</Text>
        </TouchableOpacity>
      </View>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(250,250,250,0.90)',
    height: normalizeH(49),
    width: PAGE_WIDTH,
    justifyContent: 'space-between',
  },
  btnContainer: {
    height: normalizeH(50),
    padding: normalizeH(5),
    width: normalizeW(90),
    backgroundColor: THEME.colors.green,
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: em(16),
  },
  priceBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    margin: normalizeH(8),
  },
  priceText: {
    flex: 1,
    color: '#FF7819',
    fontSize: em(20),
    padding: 0,
    textAlignVertical: 'center',
  },
  priceTitle: {
    color: '#FF7819',
    fontSize: em(20),
    marginLeft: normalizeW(10),
    marginRight: normalizeW(10),
  },
  originalPriceText: {
    fontSize: em(10),
    color: 'rgba(0,0,0,0.50)'
  },
  setPriceText: {
    color: 'rgba(0,0,0,0.50)',
    fontSize: em(10),
    marginLeft: normalizeW(15)
  }
})
