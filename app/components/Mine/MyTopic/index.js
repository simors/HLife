/**
 * Created by wuxingyu on 2016/12/9.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  InteractionManager,
  TouchableHighlight,
  ListView,
} from 'react-native'
import Header from '../../common/Header'
import {getMyTopics} from '../../../selector/topicSelector'
import {fetchTopics} from '../../../action/topicActions'
import CommonListView from '../../common/CommonListView'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as Toast from '../../common/Toast'
import TopicShow from '../../Find/TopicShow'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import {Actions} from 'react-native-router-flux'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 != r2,
})

export class MyTopic extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchTopics({type:"myTopics"})
    })
  }

  renderTopicItem(value, key) {
    return (
      <TopicShow key={key}
                 containerStyle={{marginBottom: 10}}
                 topic={value}
                 onLikeButton={(payload)=>this.onLikeButton(payload)}
      />
    )
  }

  refreshTopic() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchTopics({type: "myTopics"})
    })
  }

  loadMoreData() {

  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="我的话题"
          rightType="none"
        />
        <CommonListView
          contentContainerStyle={styles.itemLayout}
          dataSource={this.props.dataSrc}
          renderRow={(rowData, rowId) => this.renderTopicItem(rowData, rowId)}
          loadNewData={()=> {
            this.refreshTopic()
          }}
          loadMoreData={()=> {
            this.loadMoreData()
          }}
        />
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {

  const topics = getMyTopics(state)
  return {
    dataSrc: ds.cloneWithRows(topics),
    topics: topics,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchTopics,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MyTopic)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  buttonImage: {
    position: 'absolute',
    alignItems: 'flex-end',
    right: 20,
    bottom: 61,
    height: 45,
    width: 45
  },
  itemLayout: {
    width: PAGE_WIDTH,
    backgroundColor: '#E5E5E5',
    ...Platform.select({
      ios: {
        paddingTop: normalizeH(65),
      },
      android: {
        paddingTop: normalizeH(45)
      }
    }),
  },
})