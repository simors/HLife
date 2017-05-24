/**
 * Created by zachary on 2016/12/13.
 */
import React, {Component} from "react"
import {
  View,
  Text,
  ListView,
  StyleSheet,
  Platform,
  RefreshControl,
  ProgressBarAndroid,
  ActivityIndicator,
  Dimensions,
} from "react-native"
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'

const PAGE_HEIGHT = Dimensions.get('window').height

export default class CommonListView extends Component {

  /**
   * hideHeader
   * hideFooter,
   * headerLoadRefresh:第一次是否默认显示刷新
   * @param props
   */
  constructor(props) {
    super(props)
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      contentHeight: 0,
      hasMore: true,
      headerLoadRefresh: props.headerLoadRefresh === true,
      hideHeader: props.hideHeader === true,
      hideFooter: props.hideFooter === true,
      separatorStyle: props.separatorStyle ? props.separatorStyle : styles.separator,
      hideSeparator: props.hideSeparator === true,
      dataSource: ds.cloneWithRows(['row 1', 'row 2']),
    }
  }

  // componentDidMount() {
  //   this.onRefresh()
  // }
  shouldComponentUpdate(nextProps, nextState){
    // if (Immutable.fromJS(this.props) != Immutable.fromJS(nextProps)) {
    //   return true
    // }
    return false
  }
  onContentSizeChange(contentWidth, contentHeight) {
    // console.log('onContentSizeChange.contentHeight===', contentHeight)
    this.setState({contentHeight})
  }

  render() {
    return (
      <ListView
        ref="listView"
        enableEmptySections={true}
        onContentSizeChange={(contentWidth, contentHeight) => {this.onContentSizeChange(contentWidth, contentHeight)}}
        automaticallyAdjustContentInsets={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={true}
        onEndReached={this.onLoadMore.bind(this)}
        onEndReachedThreshold={10}
        contentContainerStyle={{backgroundColor: 'white'}}
        renderSectionHeader={this.props.renderSectionHeader}
        onScroll={this.props.onScroll}
        renderSeparator={(sectionID, rowID) => this.state.hideSeparator ?
          <View key={`${sectionID}-${rowID}`} style={this.state.separatorStyle}/> : null}
        renderFooter={() => this.state.hideFooter ? null : this.showFootView() }
        refreshControl={
          this.state.hideHeader ?
            null : this.showRefreshControl()
        }
        {...this.props}
      />
    )
  }

  showRefreshControl() {
    return (
      <RefreshControl
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        refreshing={this.state.headerLoadRefresh}
        onRefresh={this.onRefresh.bind(this)}
        tintColor="#969696"
        colors={['#0081F0']}
        enabled={this.state.hideHeader ? false : true}
      />
    )
  }

  showFootView = ()=> {
    return (
      this.state.hasMore
        ? this.footLoad()
        : this.footNoMore()
    )
  }

  footLoad = () => {
    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator
          animating={true}
          size="small"
          color={'#C8C8C8'}
        />
        <Text style={styles.footText}>{'加载中...'}</Text>
      </View>
    )
  }

  footNoMore = ()=> {
    return (
      <View style={styles.footerContainer}>
        <View style={styles.footLine}/>
        <Text style={styles.footText}>{'已经到底啦!!!'}</Text>
        <View style={styles.footLine}/>
      </View>
    )
  }

  isPullDown = (pullDown)=> {
    this.setState({headerLoadRefresh: pullDown})
  }
  isLoadUp = (loadUp)=> {
    this.setState({hasMore: loadUp})
  }

  hideHeader = (hideHeader)=> {
    this.setState({hideHeader: hideHeader})
  }
  hideFooter = (hideFooter)=> {
    this.setState({hideFooter: hideFooter})
  }

  /**
   * PullDown
   */
  onRefresh = () => {
    this.props.loadNewData()
  }

  /**
   * LoadMore
   */
  onLoadMore = () => {
    return this.props.loadMoreData()
  }
}

CommonListView.defaultProps = {
  contentViewHeight: PAGE_HEIGHT,
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  footerContainer: {
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
    paddingTop: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  footText: {
    color: '#b4b4b4',
    paddingLeft: 12,
    paddingRight: 12,
    fontSize: em(12),
  },
  footLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: '#e0e0e0',
  },
  separator: {
    height: 10,
    backgroundColor: '#F5F5F5',
    borderTopWidth: 0.5,
    borderTopColor: '#e0e0e0',
    borderBottomWidth: 0.5,
    borderBottomColor: '#F5F5F5',
  }
})