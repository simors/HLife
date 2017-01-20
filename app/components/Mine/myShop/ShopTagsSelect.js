/**
 * Created by zachary on 2017/1/11.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  ListView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Platform,
  InteractionManager
} from 'react-native'

import CommonButton from '../../common/CommonButton'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import THEME from '../../../constants/themes/theme1'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

export default class ShopTagsSelect extends Component {
  constructor(props) {
    super(props)
  }

  componentWillReceiveProps(nextProps) {

  }

  onTagPress(item, selected) {
    if(this.props.onTagPress) {
      this.props.onTagPress(item, selected)
    }
  }

  renderTags() {
    if(this.props.tags && this.props.tags.length) {
      let tagsView = this.props.tags.map((item, index)=>{
        let isSelected = false
        let selected = false
        let selectedContainerStyle = {}
        let selectedTagTextStyle = {}
        if(this.props.selectedTags && this.props.selectedTags.length) {
          this.props.selectedTags.forEach((selectedTag)=>{
            if(item.id == selectedTag.id) {
              isSelected = true
              return
            }
          })
          if(isSelected) {
            selected = true
            selectedContainerStyle = {
              borderColor: THEME.colors.green,
              backgroundColor: THEME.colors.green
            }
            selectedTagTextStyle = {
              color: '#fff',
            }
          }
        }
        return (
        <TouchableWithoutFeedback key={'tag_' + index} onPress={()=>{this.onTagPress(item, selected)}}>
          <View style={[styles.tagContainer, this.props.tagContainerStyle, selectedContainerStyle]}>
            <Text numberOfLines={1} style={[styles.tagText, this.props.tagTextStyle, selectedTagTextStyle]}>{item.name}</Text>
          </View>
        </TouchableWithoutFeedback>
        )
      })

      return tagsView
    }
  }

  onBtnPress() {
    if(this.props.onOverlayPress) {
      this.props.onOverlayPress()
    }
  }

  onOverlayPress() {
    if(this.props.onOverlayPress) {
      this.props.onOverlayPress()
    }
  }

  render() {
    if(this.props.show) {
      return (
        <View style={[styles.container, this.props.containerStyle]}>
          <TouchableWithoutFeedback onPress={()=>{this.onOverlayPress()}}>
            <View style={[styles.overlay, this.props.overlayStyle]}>
              <View style={[styles.tagsContainer, this.props.tagsContainerStyle]}>
                <ScrollView
                  style={[styles.scrollView, this.props.scrollViewStyle]}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={[styles.contentContainerStyle, this.props.contentContainerStyle]}
                >
                  {this.renderTags()}
                </ScrollView>
                <CommonButton
                  buttonStyle={{marginTop:10}}
                  onPress={()=>{this.onBtnPress()}}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      )
    }else {
      return null
    }

  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  tagsContainer: {
    padding: 10,
    backgroundColor: '#fff'
  },
  scrollView: {

  },
  contentContainerStyle: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap'
  },
  tagContainer: {
    margin:5,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: normalizeBorder(),
    borderColor: '#bdc6cf',
    borderRadius: 20,
    marginRight: 5,
  },
  tagText: {
    fontSize: 15
  },
})