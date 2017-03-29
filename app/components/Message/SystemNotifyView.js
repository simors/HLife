/**
 * Created by zachary on 2017/3/29.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  Platform,
  TouchableOpacity,
  ScrollView,
  ListView,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import * as Toast from '../common/Toast'
import * as pushSelector from '../../selector/pushSelector'
import * as numberUtils from '../../util/numberUtils'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class SystemNotifyView extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  componentDidMount() {

  }

  handleNoticeClick(item) {
    let payload = {
      url: item.message_url,
      showHeader: !!item.message_title,
      headerTitle: item.message_title
    }
    Actions.COMMON_WEB_VIEW(payload)
  }

  renderNoticeList(){
    console.log('renderNoticeList======', this.props.systemNoticeList)
    if(this.props.systemNoticeList && this.props.systemNoticeList.length) {
      console.log('renderNoticeList.f.dfa')
      let listView = this.props.systemNoticeList.map((item, index)=>{
        return(
          <View style={styles.listItemContainer} key={index}>
            <View style={styles.itemTimeBox}>
              <Text style={styles.itemTime}>{item.notice_time}</Text>
            </View>

            <TouchableOpacity style={{}} onPress={()=>{this.handleNoticeClick(item)}}>
              <View style={styles.itemContentBox}>
                {item.message_cover_url &&
                  <Image style={styles.itemImg} source={{uri: item.message_cover_url}} />
                }
                <Text style={styles.itemTitle}>{item.message_title}</Text>
                <Text style={styles.itemAbstract}>{item.message_abstract}</Text>
              </View>
            </TouchableOpacity>
          </View>
        )
      })

      return (
        <ScrollView>
          {listView}
        </ScrollView>
      )
    }else{
      console.log('renderNoticeList.nodnfodnd')
      return (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataTxt}>暂无系统消息</Text>
        </View>
      )
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="系统消息"
        />
        <View style={styles.body}>
          {this.renderNoticeList()}
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let systemNoticeList = pushSelector.selectSystemNoticeList(state)
  if(systemNoticeList && systemNoticeList.length) {
    systemNoticeList.forEach((item)=>{
      if(!numberUtils.isExceededOneDay(item.timestamp)){
        item.notice_time = numberUtils.getConversationTime(item.timestamp)
      }
    })
  }
  return {systemNoticeList}
}

const mapDispatchToProps = (dispatch) => bindActionCreators({

}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SystemNotifyView)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  body: {
    ...Platform.select({
      ios: {
        marginTop: normalizeH(64),
      },
      android: {
        marginTop: normalizeH(44)
      }
    }),
    flex: 1,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noDataTxt: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#d8d8d8'
  },
  listItemContainer: {
    flex: 1,
    padding: 15
  },
  itemTimeBox: {
    alignSelf: 'center',
    padding: 4,
    paddingLeft: 8,
    paddingRight: 8,
    marginBottom: 10,
    backgroundColor: 'gray'
  },
  itemTime: {
    fontSize: 12,
    color: 'white'
  },
  itemContentBox: {
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 15,
    paddingLeft: 10,
    paddingRight: 10,
  },
  itemImg: {
    width: PAGE_WIDTH - 50,
    height: 105,
    marginBottom: 10
  },
  itemTitle: {
    fontSize: 17,
    color: '#030303',
    marginBottom: 10
  },
  itemAbstract: {
    fontSize: 15,
    color: '#5a5a5a',
  }
})