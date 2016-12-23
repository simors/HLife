/**
 * Created by zachary on 2016/12/13.
 */
import {Map, List, Record} from 'immutable'
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
  InteractionManager,
  ScrollView
} from 'react-native'
import {connect} from 'react-redux'
import AV from 'leancloud-storage'
import {bindActionCreators} from 'redux'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import Categorys from '../Articles/Categorys'
import {Actions} from 'react-native-router-flux'
import THEME from '../../constants/themes/theme1'
import {fetchColumn} from '../../action/configAction'
import {getColumn} from '../../selector/configSelector'
import CommonModal from '../common/CommonModal'



 class Columns extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible : false
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchColumn()

    })
  }



  renderColumns() {
    if (this.props.column) {
      return (
        this.props.column.map((value, key) => {
          let imageUrl = value.imageSource
           return (
            <View key={key} style={styles.channelWrap}>
              <TouchableOpacity onPress={()=> {
                Actions.ARTICLES_ARTICLELIST({categoryId: value.columnId})
              }}>
               <Image style={[styles.defaultImageStyles,this.props.imageStyle]} source={{uri: imageUrl}}/>
                <Text style={styles.channelText}>{value.title}</Text>
              </TouchableOpacity>
            </View>
          )
        })
      )
    }
  }

   closeModel(callback) {
     this.setState({
       modalVisible: false
     })
     if(callback && typeof callback == 'function'){
       callback()
     }
   }
   openModel(callback) {
     this.setState({
       modalVisible: true
     })
     if(callback && typeof callback == 'function'){
       callback()
     }
   }

  render() {
    return (
      <View style={styles.channelContainer}>
        {this.renderColumns()}
          <TouchableOpacity style={styles.channelWrap} onPress={() => {
            this.openModel()
          }}>
            <Image source={require("../../assets/images/home_more.png")}/>
            <Text style={styles.channelText}>更多</Text>
          </TouchableOpacity>
        <CommonModal
          modalVisible={this.state.modalVisible}
          modalTitle="精选栏目"
          closeModal={() => this.closeModel()}
        >
          <ScrollView>
            <Categorys/>
          </ScrollView>
        </CommonModal>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let column = getColumn(state, 'choice')
  return {
    column: column,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchColumn
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Columns)

const styles = StyleSheet.create({
  channelContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff'
  },
  defaultImageStyles:{
    height:normalizeH(35),
    width:normalizeW(35),
  },
  channelWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow:'hidden'
  },
  channelText: {
    marginTop: 4,
    color:THEME.colors.gray,
    textAlign: 'center'
  },
})