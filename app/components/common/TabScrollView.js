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
  RefreshControl,
} from 'react-native'
import {em, normalizeW, normalizeH} from '../../util/Responsive'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import THEME from '../../constants/themes/theme1'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export class TabScrollView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      topicItem: 0,
      isRefreshing:false
    }
  }

  componentDidMount() {
    this.props.topics.map((value, key)=> {
      if (value.objectId == this.props.topicId) {
        this.setState({topicItem: key})
      }
    })
  }

  _onRefresh(){
    this.setState({isRefreshing: true})
    setTimeout(() => {
      this.props.refreshTopic()
      this.setState({isRefreshing: false})
    }, 100)
}

  changeTab(payload) {
    if (this.props.onSelected) {
      this.props.onSelected(payload.i)
    }
    this.setState({topicItem: payload.i})
  }

  renderTopics() {
    return (
      this.props.topics.map((value, key)=> {
        return (
          <View key={key} tabLabel={value.title}
                style={[styles.itemLayout, this.props.itemLayout && this.props.itemLayout]}>
            <ScrollView
              style={styles.scrollViewStyle}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isRefreshing}
                  onRefresh={this._onRefresh.bind(this)}
                  colors={['#ff0000', '#00ff00','#0000ff','#3ad564']}
                  progressBackgroundColor="#ffffff"
                /> }>
              {this.props.renderTopicPage()}
            </ScrollView>
          </View>
        )
      })
    )
  }

  renderTabBar() {
    return (
      <ScrollableTabBar
        activeTextColor={this.props.activeTextColor}
        inactiveTextColor={this.props.inactiveTextColor}
        style={[styles.tarBarStyle, this.props.tarBarStyle && this.props.tarBarStyle]}
        underlineStyle={[styles.tarBarUnderlineStyle, this.props.tarBarUnderlineStyle && this.props.tarBarUnderlineStyle]}
        textStyle={[styles.tabBarTextStyle, this.props.tabBarTextStyle && this.props.tabBarTextStyle]}
        tabStyle={[styles.tabBarTabStyle, this.props.tabBarTabStyle && this.props.tabBarTabStyle]}
        backgroundColor={this.props.backgroundColor}
      />
    )
  }

  render() {
    if (this.props.topics) {
      return (
        <ScrollableTabView style={[styles.body, this.props.body && this.props.body]}
                           page={this.state.topicItem}
                           scrollWithoutAnimation={true}
                           renderTabBar={()=> this.renderTabBar()}
                           onChangeTab={(payload) => this.changeTab(payload)}
        >
          {this.renderTopics()}
        </ScrollableTabView>
      )
    }
  }
}

TabScrollView.defaultProps = {
  // style
  tabBarTextStyle: {},
  tabBarTabStyle: {},
  tarBarUnderlineStyle: {},
  tarBarStyle: {},
  body: {},

  inactiveTextColor: '#686868',
  activeTextColor: THEME.colors.green,
  backgroundColor: '#f2f2f2',
}

const styles = StyleSheet.create({
  body: {
    ...Platform.select({
      ios: {
        paddingTop: normalizeH(64),
      },
      android: {
        paddingTop: normalizeH(45)
      }
    }),
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#E5E5E5',
  },
  itemLayout: {
    flex: 1,
    marginBottom:50,
    //  alignItems: 'center',
//    justifyContent: 'center'
  },
  tabBarTextStyle: {
    fontSize: 16,
    paddingBottom: 10,
  },

  tabBarTabStyle: {
    paddingBottom: 0,
    paddingLeft: 12,
    paddingRight: 12
  },


  tabBarUnderLineStyle: {
    height: 0,
  },

  tabBarStyle: {
    height: 38,
  },
  scrollViewStyle: {
    flex: 1,
    width: PAGE_WIDTH
  },
})