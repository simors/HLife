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
  ListView,
} from 'react-native'
import {em, normalizeW, normalizeH} from '../../util/Responsive'
import ScrollableTabView, {ScrollableTabBar} from '../../components/common/ScrollableTableView';
import THEME from '../../constants/themes/theme1'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export class TabScrollView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      topicItem: 0,
      isRefreshing: false
    }
  }

  componentDidMount() {
    this.props.topics.map((value, key)=> {
      if (value.objectId == this.props.topicId) {
        this.setState({topicItem: key})
      }
    })
  }


  changeTab(payload) {
    if (this.props.onSelected) {
      this.props.onSelected(payload.i)
    }
    this.setState({topicItem: payload.i})
  }


  renderTabBar() {
    return (
      <ScrollableTabBar
        activeTextColor={this.props.activeTextColor}
        inactiveTextColor={this.props.inactiveTextColor}
        style={[styles.tabBarStyle, this.props.tarBarStyle && this.props.tarBarStyle]}
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
                           initialPage={this.state.topicItem}
                           scrollWithoutAnimation={true}
                           renderTabBar={()=> this.renderTabBar()}
                           onChangeTab={(payload) => this.changeTab(payload)}
        >
          {this.props.renderTopics()}
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
  topicsData: undefined,

  inactiveTextColor: '#686868',
  activeTextColor: THEME.colors.green,
  backgroundColor: '#f2f2f2',
}

const styles = StyleSheet.create({
  body: {
    ...Platform.select({
      ios: {
        marginTop: normalizeH(64),
      },
      android: {
        marginTop: normalizeH(45)
      }
    }),
    flex: 1,
  },

  tabBarTextStyle: {
    fontSize: 16,
    paddingBottom: 11,
  },

  tabBarTabStyle: {
    paddingBottom: 0,
    paddingLeft: 12,
    paddingRight: 12
  },


  tarBarUnderlineStyle: {
    height: 2,
    backgroundColor:THEME.colors.green,
  },

  tabBarStyle: {
    height: 38,
  },
  scrollViewStyle: {
    flex: 1,
    width: PAGE_WIDTH
  },
})