/**
 * Created by zachary on 2016/12/13.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform
} from 'react-native'
import {Actions} from 'react-native-router-flux'

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import Thumbnail from '../common/Thumbnail'
import * as authSelector from '../../selector/authSelector'

class Health extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.healthWrap}>
        <View style={styles.healthBottom}>
          <View style={styles.homeQuesStyle}>
            <Thumbnail
              sourceImage={require("../../assets/images/home_question.png")}
              thumbnailTitle="快速问诊"
              thumbnailIntro="专业医生在线答疑"
              onPress={()=>{this.props.isUserLogined? Actions.INQUIRY(): Actions.LOGIN()}}
            />
          </View>
          <View style={styles.line}/>
          <View style={styles.findDoctorStyle}>
            <Thumbnail
              sourceImage={require("../../assets/images/home_doctor.png")}
              thumbnailTitle="找名医"
              thumbnailIntro="一对一对症咨询"
              onPress={()=>{Actions.DOCTER_FINDER()}}
            />
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const isUserLogined = authSelector.isUserLogined(state)
  return {
    isUserLogined: isUserLogined
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({

}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Health)

const styles = StyleSheet.create({
  healthWrap: {
    flex: 1,
    backgroundColor: '#fff',
  },
  healthBottom: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch'
  },
  homeQuesStyle: {
    flex: 1,
  },
  line: {
    marginTop: normalizeH(19),
    marginBottom: normalizeH(19),
    borderRightWidth: normalizeBorder(3),
    borderRightColor: '#E5E5E5',
  },
  findDoctorStyle: {
    flex: 1,
  },
})