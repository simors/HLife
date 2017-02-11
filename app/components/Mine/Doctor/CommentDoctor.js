/**
 * Created by wanpeng on 2017/1/17.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  InteractionManager,
  ScrollView,
  Text,
  ListView,
  Image,
  TouchableOpacity,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/Ionicons'
import Header from '../../common/Header'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class CommentDoctor extends Component {
  constructor(props) {
    super(props)
  }


  renderOriginalInquiry() {
    return (
      <View style={styles.itemView}>
        <TouchableOpacity style={styles.selectItem} onPress={() => Actions.INQUIRY_MESSAGE_BOX()}>
          <Text numberOfLines={1} style={{}}>
            {'原问题：' + '最近老是失眠。。。。。。' + '(男， 57岁)'}
          </Text>
          <View style={{position: 'absolute', right: 3, top: 3}}>
            <Icon name='ios-arrow-forward' size={30} color={'red'}/>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          headerContainerStyle={styles.header}
          leftType="icon"
          leftStyle={styles.left}
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="效果评价"
          rightType="text"
          rightText="提交"
          rightStyle={styles.left}
        />
        <View style={styles.itemContainer}>
          <View>
            {this.renderOriginalInquiry()}
            <View>
              <TouchableOpacity style={{}} onPress={() => {}}>
                <Image source={{}} />
                <Text>老王</Text>
                <Text>名医</Text>
              </TouchableOpacity>
              <View>
                <Text>您对医生对服务满意吗？</Text>
                <View>
                  <View style={{flex: 1}}>
                    <Image source={require("../../../assets/images/writer_loaction.png")}/>
                    <Text>很满意</Text>
                  </View>
                </View>
                <Text>给医生一些评价吧～</Text>

              </View>
            </View>

          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CommentDoctor)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  header: {
    backgroundColor: '#50E3C2',
  },
  left: {
    fontFamily: 'PingFangSC-Regular',
    fontSize: 17,
    color: '#FFFFFF',
    letterSpacing: -0.41,
  },
  itemContainer: {
    width: PAGE_WIDTH,
    ...Platform.select({
      ios: {
        paddingTop: normalizeH(65),
      },
      android: {
        paddingTop: normalizeH(45)
      }
    }),
  },
  itemText: {
    fontFamily:'PingFangSC-Regular',
    fontSize: em(15),
    color: '#9B9B9B'
  },
  numText: {
    fontFamily:'PingFangSC-Semibold',
    fontSize: em(17),
    color: '#F6A623'
  },
  itemView: {
    borderBottomWidth: 1,
    borderColor: '#E6E6E6',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  selectItem: {
    width: PAGE_WIDTH,
    flexDirection: 'row',
    height: normalizeH(40),
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
})