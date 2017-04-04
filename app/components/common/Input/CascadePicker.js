/**
 * Created by yangyang on 2017/4/4.
 */
import React, {Component} from 'react'
import {
  View,
  Picker,
  Text,
  Platform,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableOpacity,
} from 'react-native'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
import THEME from '../../../constants/themes/theme1'

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

const isIos = Platform.OS === 'ios'

/*************************************************
 * 传入的数据结构如下所示：
 *
 * 如果使用级联选项cascade为true，数据如下
 * data = [
 *   {
 *     label: 'a',
 *     value: [
 *       {
 *         label: 'a1',
 *         value: [{label: 'a11', value: 'x'}, {label: 'a12', value: 'y'}, {label: 'a13', value: 'z'}],
 *       },
 *       {
 *         label: 'a2',
 *         value: [{label: 'a21', value: 'm'}, {label: 'a22', value: 'n'}, {label: 'a23', value: 'q'}],
 *       },
 *     ],
 *   },
 *   {
 *     label: 'b',
 *     value: [
 *       {
 *         label: 'b1',
 *         value: [{label: 'b11', value: 'x'}, {label: 'b12', value: 'y'}, {label: 'b13', value: 'z'}],
 *       },
 *       {
 *         label: 'b2',
 *         value: [{label: 'b21', value: 'm'}, {label: 'b22', value: 'n'}, {label: 'b23', value: 'q'}],
 *       },
 *     ],
 *   },
 * ]
 *
 * 如果不使用级联选项cascade为false，数据如下：
 * data = [
 *   ['a', 'b', 'c'],
 *   ['m', 'n', 'q'],
 * ]
 */

export default class CascadePicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isVisible: this.props.isVisible,
      selectedValues: [],
    }
    this.level = 1
    this.wheelFlex = []
  }

  componentDidMount() {
    this.level = this.props.level
    if (!this.props.wheelFlex) {
      for (let i = 0; i < this.level; i++) {
        this.wheelFlex[i] = 1
      }
    }
  }

  close() {
    this.setState({ isVisible: false })
  }

  open() {
    this.setState({ isVisible: true })
  }

  _handleCancel() {
    if (this.props.onCancel) {
      this.props.onCancel()
    }
    this.close()
  }

  _handleSubmit() {
    if (this.props.onSubmit) {
      this.props.onSubmit({
        selectedValues: this.state.selectedValues,
      })
    }
    this.close()
  }

  _handleValueChange(value, index) {
    let selected = this.state.selectedValues
    selected[index] = value
    this.setState({selectedValues: selected})
  }

  renderNonCascadeLevelPicker() {
    let pickers = []
    for (let i = 0; i < this.level; i++) {
      let pick = (
        <Picker
          style={{flex: this.wheelFlex[i]}}
          onValueChange={(value) => this._handleValueChange(value, i)}
          selectedValue={this.state.selectedValues[i]}
        >
          {
            this.props.data[i].map((value, index) => {
              return (
                <Picker.Item value={value} label={value} key={index} />
              )
            })
          }
        </Picker>
      )
      pickers.push(pick)
    }
    return pickers
  }

  renderCascadePickerItem(index, selectedValues) {
    let data = []
    if (index == 0) {
      data = this.props.data
    } else {
      let tmpData = this.props.data
      for (let i = 0; i < index; i++) {
        for (let j = 0; j < tmpData.length; j++) {
          if (selectedValues[i] == tmpData[j].label) {
            tmpData = tmpData[j].value
            break
          }
        }
      }
      data = tmpData
    }
    return (
      data.map((item, index) => {
        return (
          <Picker.Item value={item.label} label={item.label} key={index} />
        )
      })
    )
  }

  renderCascadeLevelPicker() {
    let pickers = []
    for (let i = 0; i < this.level; i++) {
      let pick = (
        <Picker
          style={{flex: this.wheelFlex[i]}}
          onValueChange={(value) => this._handleValueChange(value, i)}
          selectedValue={this.state.selectedValues[i]}
        >
          {this.renderCascadePickerItem(i, this.state.selectedValues)}
        </Picker>
      )
      pickers.push(pick)
    }
    return pickers
  }

  renderLevelPicker() {
    if (this.props.cascade) {
      return this.renderCascadeLevelPicker()
    } else {
      return this.renderNonCascadeLevelPicker()
    }
  }

  renderPicker() {
    return (
      <View style={styles.pickerContainer}>
        <View style={styles.navWrap}>
          <TouchableOpacity style={styles.navBtn} onPress={this._handleCancel}>
            <Text style={styles.btnText}>取消</Text>
          </TouchableOpacity>
          <Text style={styles.titleText}>{this.props.title}</Text>
          <TouchableOpacity style={styles.navBtn} onPress={this._handleSubmit}>
            <Text style={styles.btnText}>确定</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.pickerWrap}>
          {this.renderLevelPicker()}
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Modal
          transparent={this.props.transparent}
          visible={this.state.isVisible}
          onRequestClose={this.close}
          animationType={this.props.animationType}
        >
          {this.renderPicker()}
        </Modal>
      </View>
    )
  }
}

CascadePicker.defaultProps = {
  animationType: 'slide',
  cascade: true,
  transparent: true,
  onSubmit: () => {},
  onCancel: () => {},
  level: 1,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pickerContainer: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  pickerWrap: {
    flexDirection: 'row',
  },
  navWrap: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#ccc'
  },
  navBtn: {
    borderWidth: 1,
    borderRadius: 4,
    color: THEME.base.mainColor,
    padding: normalizeW(2),
  },
  titleText: {
    flex: 1,
    fontSize: em(17),
    color: '#5a5a5a',
  },
  btnText: {
    fontSize: em(15),
    color: THEME.base.mainColor,
  }
})