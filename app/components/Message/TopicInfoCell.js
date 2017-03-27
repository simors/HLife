/**
 * Created by yangyang on 2017/1/20.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Image,
  Text,
  Platform,
  TouchableOpacity,
  InteractionManager,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import {fetchTopicById} from '../../action/topicActions'
import {getTopicById} from '../../selector/topicSelector'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'

class ShopInfoCell extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchTopicById({topicId: this.props.topicId})
    })
  }

  renderCoverImage() {
    if (!this.props.topicInfo) {
      return <View/>
    }
    if (this.props.topicInfo.imgGroup.length > 0) {
      return (
        <Image style={{width: 80, height: 80}} source={{uri: this.props.topicInfo.imgGroup[0]}}></Image>
      )
    }
    return <View/>
  }

  render() {
    if (!this.props.topicInfo) {
      return <View/>
    }
    return (
      <View style={styles.topicView}>
        <TouchableOpacity onPress={() => Actions.TOPIC_DETAIL({topic: this.props.topicInfo})}>
          <View style={{flexDirection: 'row', backgroundColor: 'rgba(242,242,242,0.50)'}}>
            {this.renderCoverImage()}
            <View style={{flex: 1,padding: 10, paddingBottom: 0}}>
              <Text style={{fontSize: em(17), color: '#4a4a4a'}} numberOfLines={1}>{this.props.topicInfo.title}</Text>
              <Text style={styles.abstractStyle} numberOfLines={2}>
                {this.props.topicInfo.abstract}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let newProps = {}
  let topicInfo = getTopicById(state, ownProps.topicId)
  newProps.topicInfo = topicInfo
  return newProps
}
const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchTopicById,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ShopInfoCell)

const styles = StyleSheet.create({
  topicView: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 12,
  },
  abstractStyle: {
    marginTop: 5,
    marginBottom: 5,
    marginRight: 10,
    fontSize: em(15),
    lineHeight: em(20),
    color: "#9b9b9b"
  },
})