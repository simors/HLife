/**
 * Created by wanpeng on 2017/5/10.
 */
import React, {Component} from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import { normalizeW, normalizeH} from '../../util/Responsive'


class SearchBar extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <TouchableOpacity style={styles.container}
                        onPress={() => Actions.SEARCH()}>
        <View style={styles.search}>
          <Image source={require('../../assets/images/search.png')}/>
          <Text style={{fontSize: 15, marginLeft: normalizeH(15), color: '#fff'}}>搜索</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}
const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  search: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    height: normalizeH(30),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: normalizeH(10)
  }

})