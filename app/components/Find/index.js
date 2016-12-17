/**
 * Created by zachary on 2016/12/9.
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
  InteractionManager
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import {getTopic} from '../../selector/configSelector'
import {getAllTopics} from '../../action/configAction'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import THEME from '../../constants/themes/theme1'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export class Find extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.getAllTopics({})
    })
  }

  renderTopics() {
    return (
      this.props.topics.map((value, key)=> {
        return (
          <View tabLabel={value.title} style={styles.itemLayout}><Text >hello</Text></View>
        )
      })
    )
  }

  render() {
    if (this.props.topics) {
      return (
        <View style={styles.container}>
          <Header
            leftPress={() => Actions.pop()}
            title="发现"
            rightType="image"
            rightImageSource={require("../../assets/images/home_message.png")}
            rightPress={() => Actions.REGIST()}
          />
          <ScrollableTabView style={styles.body}
                             initialPage={0}
                             scrollWithoutAnimation={true}
                             renderTabBar={
                               ()=><ScrollableTabBar
                                 activeTextColor={THEME.colors.green}
                                 inactiveTextColor='#686868'
                                 style={{height: 38,}}
                                 underlineStyle={{height: 0}}
                                 textStyle={styles.tabBarTextStyle}
                                 tabStyle={{paddingBottom: 0, paddingLeft: 12, paddingRight: 12,}}
                                 backgroundColor='#f2f2f2'
                               />}
          >
            {()=>this.renderTopics()}
          </ScrollableTabView>
        </View>
      )
    }
  }
}

const mapStateToProps = (state, ownProps) => {

  const topics = getTopic(state, true)
  return {
    topics: topics
  }
}
const mapDispatchToProps = (dispatch) => bindActionCreators({
  getAllTopics
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Find)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: '#F5FCFF',
    // width: PAGE_WIDTH,
    // height: PAGE_HEIGHT
  },
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
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabBarTextStyle: {
    fontSize: 16,
    paddingBottom: 10,
  },
  zone: {
    flexDirection: 'row',
    width: PAGE_WIDTH / 2,
    height: normalizeH(60),
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingLeft: normalizeW(25),
    paddingTop: normalizeH(15),
    justifyContent: 'flex-start',
    alignItems: 'center',

  }
})