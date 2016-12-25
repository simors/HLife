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
  TouchableHighlight
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import {getTopicCategories} from '../../selector/configSelector'
import {getTopics} from '../../selector/topicSelector'
import {isUserLogined} from '../../selector/authSelector'
import {fetchTopics} from '../../action/topicActions'

import {TabScrollView} from '../common/TabScrollView'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {TopicShow} from './TopicShow'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export class Find extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: 0,
    }
  }

  getSelectedTab(index) {
    this.setState({selectedTab: index})
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchTopics({categoryId: this.props.topicCategories[index].objectId})
    })
  }

  renderTopicItem(value, key) {
    return (
      <TopicShow key={key}
                 containerStyle={{marginBottom: 10}}
                 topic={value}
      />
    )
  }

  refreshTopic() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchTopics({categoryId: this.props.topicCategories[this.state.selectedTab].objectId})
    })
  }

  renderTopicPage() {
    if (this.props.topics) {
      return (
        this.props.topics.map((value, key)=> {
          return (
            this.renderTopicItem(value, key)
          )
        })
      )
    }
  }

  render() {
    let topicId = this.props.topicCategories[this.state.selectedTab]
    return (
      <View style={styles.container}>
        <Header
          leftType="none"
          title="发现"
          rightType="none"
        />
        <TabScrollView topics={this.props.topicCategories}
                       topicId={this.props.topicId}
                       refreshTopic={()=>this.refreshTopic()}
                       onSelected={(index) => this.getSelectedTab(index)}
                       renderTopicPage={() => this.renderTopicPage()}/>
        <TouchableHighlight underlayColor="transparent" style={styles.buttonImage}
                            onPress={()=> {
                              if (this.props.isLogin) {
                                Actions.PUBLISH({topicId})
                              } else {
                                Actions.LOGIN()
                              }
                            }}
        >
          <Image source={require("../../assets/images/local_write@2x.png")}/>
        </TouchableHighlight>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {

  const topicCategories = getTopicCategories(state)
  const topics = getTopics(state)
  const isLogin = isUserLogined(state)
  return {
    topicCategories: topicCategories,
    topics: topics,
    isLogin: isLogin
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchTopics
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Find)

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
  }
})