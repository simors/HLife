import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  Platform,
  Modal,
  ScrollView,
  TouchableHighlight
} from 'react-native'

import AV from 'leancloud-storage'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Icon from 'react-native-vector-icons/Ionicons'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/themes/theme1'
import {getColumn} from '../../selector/configSelector'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class Categorys extends Component {
  constructor(props) {
    super(props)
    this.state = {modalVisible: false};
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  renderElems(begin) {
    return (
      this.props.column.map((value, key) => {
        if (key >= begin && key < begin + 4) {
          console.log('============>', key)
          return (
            <View key={key} style={styles.channelWrap}>
                <TouchableOpacity onPress={()=> {
              }}>
                <Image style={[styles.defaultImageStyles, this.props.imageStyle]} source={{uri: value.imageSource}}/>
                <Text style={styles.channelText}>{value.title}</Text>
              </TouchableOpacity>
              <Text>test3</Text>
            </View>
          )
        }
      })
    )
  }

  renderCategorysRow(begin) {
    return (
      <View style={styles.rowView}>
        {this.renderElems(begin)}
      </View>
    )
  }

  renderCategorys() {
    if (!this.props.column) {
      return (
        <View>
        </View>
      )
    }
    return (
      this.props.column.map((value, key) => {
        if (key % 4 == 0) {

          this.renderCategorysRow(key)
        }
      })
    )
  }

  render() {
    return (
      <View >
        <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            alert("Modal has been closed.")
          }}
          style={[styles.defaultContainer, this.props.container]}>
          <View style={styles.blankView}>
            </View>
          <View style={styles.body}>
              <View style={styles.title}>
                <Text style={styles.titletextext}>
                   更多栏目
                </Text>
              </View>
            <ScrollView>
              <View style={styles.category}>
                {this.renderCategorys()}
              </View>
            </ScrollView>

            <TouchableHighlight onPress={() => {
              this.setModalVisible(!this.state.modalVisible)
            }}>
              <View style={styles.cancelModal}>
                <Image style={{}}source={require("../../assets/images/artical_close.png")}/>
              </View>
            </TouchableHighlight>
          </View>
        </Modal>

        <TouchableOpacity onPress={() => {
          // let ArticleObject=AV.Object.extend('Articles')
          {/*let image1 = 'http://img1.3lian.com/2015/a1/53/d/198.jpg'*/}
          {/*let image2 = 'http://www.qq745.com/uploads/allimg/141106/1-141106153Q5.png'*/}
          {/*let image3 = 'http://img1.3lian.com/2015/a1/53/d/200.jpg'*/}
          {/*var todo = new AV.Object('Articles')*/}
          {/*let images= [image1,image2,image3];*/}
          {/*todo.addUnique('images', images);*/}
          {/*todo.save();*/}
          {/*console.log('===========>save',todo.id)*/}
          {/*//console.log('==========>',images)*/}

          this.setModalVisible(true)
        }}>
          <Image source={require("../../assets/images/home_more.png")}/>
          <Text style={styles.channelText}>更多</Text>
        </TouchableOpacity>
      </View>

    )
  }
}

Categorys.defaultProps = {
  //visible: 'true'
  defaultContainer:{},
  defaultImageStyles:{},
}

const mapStateToProps = (state, ownProps) => {
  let column = getColumn(state)
  console.log("new column========>: ", column)
  return {
    column: column,
  }
}

// const mapDispatchToProps = (dispatch) => bindActionCreators({
//
// }, dispatch)


export default connect(mapStateToProps)(Categorys)

const styles = StyleSheet.create({
  body:{
    backgroundColor:'#FFFFFF',
    opacity:1,
  },
  blankView:{
    height:normalizeH(186),
    opacity:0.3,
    backgroundColor:'#000000'
  },
  defaultContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    width: PAGE_WIDTH,
    marginTop: normalizeH(186),
    opacity:80
  },
  rowView: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff'
  },
  defaultImageStyles: {
    height: normalizeH(35),
    width: normalizeW(35),
  },
  category: {
    width: PAGE_WIDTH,
    height: normalizeH(276),
    borderWidth: normalizeBorder(2),
    backgroundColor:'#FFFFFF',
    opacity:1,
    marginTop:normalizeH(3),
  },
  title:{
    height:normalizeH(67),
    width:PAGE_WIDTH,
    borderWidth:normalizeBorder(1),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#FFFFFF',
    opacity:1,
  },
  titletext:{
    height:normalizeH(20),
    fontSize:normalizeW(18),
    width:normalizeW(186),
  },
  cancelModal:
  {

    justifyContent: 'center',
    alignItems: 'center',
    marginTop:normalizeH(3),
    height:normalizeH(132),
    width:PAGE_WIDTH,
    backgroundColor:'#FFFFFF',
    opacity:1,

  },
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