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
  InteractionManager
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import * as msgTypes from '../../constants/messageActionTypes'
import {hasNewMessageByType, getNewestMessageByType, getOrderedConvsByType} from '../../selector/messageSelector'
import {hasNewNoticeByType, getNewestNoticeByType} from '../../selector/notifySelector'
import * as pushSelector from '../../selector/pushSelector'
import {updateSystemNotice, updateSystemNoticeAsMarkReaded} from '../../action/pushAction'
import Icon from 'react-native-vector-icons/Ionicons'
import CommonListView from '../common/CommonListView'
import {PERSONAL_CONVERSATION} from '../../constants/messageActionTypes'
import {fetchConversation} from '../../action/messageAction'
import ConversationItem from './ConversationItem'
import {isUserLogined} from '../../selector/authSelector'
import * as Toast from '../common/Toast'


class NotifyTopicList extends Component {
	constructor(props) {
    super(props)
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      
    })
  }

  renderContent() {
  	return (
  		<View><Text>123</Text></View>
  	)
  }

  render() {
  	return (
  		<View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="话题互动"
          rightType="text"
          rightPress={()=>{Toast.show('清空')}}
          rightText='清空'
          rightStyle={{color:'#ff7819'}}
        />
        <View style={styles.body}>
        	{this.renderContent()}
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

export default connect(mapStateToProps, mapDispatchToProps)(NotifyTopicList)

const styles = StyleSheet.create({
	container: {
    flex: 1
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
})