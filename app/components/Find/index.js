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
  InteractionManager
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import {getTopic} from '../../selector/configSelector'
import {TabScrollView} from '../common/TabScrollView'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export class Find extends Component {
  constructor(props) {
    super(props)
  }

  render() {
      return (
        <View style={styles.container}>
          <Header
            leftPress={() => Actions.pop()}
            title="发现"
            rightType="image"
            rightImageSource={require("../../assets/images/home_message.png")}
            rightPress={() => Actions.REGIST()}
          />
         <TabScrollView topics={this.props.topics} topicId={this.props.topicId}/>
        </View>
      )
  }
}

const mapStateToProps = (state, ownProps) => {

  const topics = getTopic(state, true)
  return {
    topics: topics
  }
}
const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Find)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
})