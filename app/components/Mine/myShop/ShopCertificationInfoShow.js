/**
 * Created by zachary on 2017/4/2.
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
 	Platform,
 	InteractionManager
 } from 'react-native'
 import {connect} from 'react-redux'
 import {bindActionCreators} from 'redux'
 import {Actions} from 'react-native-router-flux'
 import Header from '../../common/Header'
 import {fetchUserOwnedShopInfo, unregistShop} from '../../../action/shopAction'
 import {getUserInfoById} from '../../../action/authActions'
 import {selectUserOwnedShopInfo} from '../../../selector/shopSelector'
  import {activeUserId, activeUserInfo} from '../../../selector/authSelector'
 import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
 import Popup from '@zzzkk2009/react-native-popup'
 import * as Toast from '../../common/Toast'

 const PAGE_WIDTH = Dimensions.get('window').width
 const PAGE_HEIGHT = Dimensions.get('window').height

class ShopCertificationInfoShow extends Component {
	constructor(props) {
		super(props)
	}

	componentWillMount() {
		InteractionManager.runAfterInteractions(()=>{
			this.props.fetchUserOwnedShopInfo()
		})
	}

	unregistShop() {
		Popup.confirm({
      title: '注销店铺',
      content: '注销后此店铺的所有信息将在平台上删除，是否注销？',
      ok: {
        text: '注销',
        style: {color: 'red'},
        callback: ()=>{
          // console.log('ok')
          this.props.unregistShop({
          	shopId: this.props.userOwnedShopInfo.id,
          	success: ()=>{
          		Toast.show('注销店铺成功', {
          			onHidden: ()=>{
          				this.props.getUserInfoById({userId: this.props.activeUserId})
          				this.props.fetchUserOwnedShopInfo()
          				Actions.HOME({type: 'reset'})
          			}
          		})
          	}
          })
        }
      },
      cancel: {
        text: '取消',
        callback: ()=>{
          // console.log('cancel')
        }
      }
    })
	}

	render() {
		const userOwnedShopInfo = this.props.userOwnedShopInfo
    const targetShopCategory = userOwnedShopInfo.targetShopCategory

    return (
    	<View style={styles.container}>
    		<Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="店铺认证信息"
          rightType="none"
        />

				<View style={styles.body}>
					<ScrollView>
						<View style={styles.row}>
							<View style={styles.label}>
                <Text style={styles.labelTxt}>手机号</Text>
              </View>
              <View style={styles.content}>
                <Text style={styles.contentTxt}>{userOwnedShopInfo.phone || ''}</Text>
              </View>
						</View>
						<View style={[styles.row, styles.borderTop, styles.gutter]}>
							<View style={styles.label}>
                <Text style={styles.labelTxt}>店铺分类</Text>
              </View>
              <View style={styles.content}>
                <Text style={styles.contentTxt}>{targetShopCategory.text || ''}</Text>
              </View>
						</View>

						<View style={styles.row}>
							<View style={styles.label}>
								<Text style={styles.labelTxt}>店铺名称</Text>
							</View>
							<View style={styles.content}>
								<Text style={styles.contentTxt}>{userOwnedShopInfo.shopName || ''}</Text>
							</View>
						</View>
						<View style={[styles.row, styles.borderTop, styles.gutter]}>
							<View style={styles.label}>
								<Text style={styles.labelTxt}>店铺地址</Text>
							</View>
							<View style={styles.content}>
								<Text style={styles.contentTxt}>{userOwnedShopInfo.shopAddress || ''}</Text>
							</View>
						</View>

						<View style={styles.notes}>
							<Text style={styles.explainTitle}>说明</Text>
							<Text style={styles.explainTxt}>以上信息为平台认证信息，不得随意修改。</Text>
              {false
                ? <Text style={styles.explainTxt}>
                    如需注册新店，可以选择<Text onPress={()=>{this.unregistShop()}} style={styles.sltTxt}>注销店铺</Text>，但注销后此店铺的所有信息将在平台上删除，请慎重选择。
                  </Text>
                : null
              }
							
						</View>


					</ScrollView>
				</View>

    	</View>
    )

	}
}

const mapStateToProps = (state, ownProps) => {
	const userOwnedShopInfo = selectUserOwnedShopInfo(state)

	return {
		userOwnedShopInfo: userOwnedShopInfo,
		activeUserId: activeUserId(state),
	}
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
	fetchUserOwnedShopInfo,
	unregistShop,
	getUserInfoById
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ShopCertificationInfoShow)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.05)'
	},
	body: {
		marginTop: normalizeH(64),
    flex: 1,
  },
  row: {
  	flexDirection: 'row',
  	padding: 15,
  	paddingTop: 10,
  	paddingBottom: 10,
  	backgroundColor: 'white',
  },
  label: {
  	width: 90,
  	justifyContent: 'center'
  },
  labelTxt: {
  	color: '#5a5a5a',
  	fontSize: 17,
  	lineHeight: 28
  },
  content: {
  	flex: 1,
  },
  contentTxt: {
		color: '#000',
  	fontSize: 17,
  	lineHeight: 28
  },
  borderTop: {
		borderTopWidth: normalizeBorder(),
    borderTopColor: '#f5f5f5',
  },
  gutter: {
  	marginBottom: 8
  },
  certifiedImg: {
  	width: 115,
  	height:90,
  	alignSelf: 'flex-end'
  },
  notes: {
  	padding: 15,
  	backgroundColor: 'white'
  },
  explainTitle: {
  	color: '#5a5a5a',
  	fontSize: 17,
  	marginBottom: 15
  },
  explainTxt: {
  	color: '#b2b2b2',
  	fontSize: 15,
  	lineHeight: 20
  },
  sltTxt: {
  	color: '#FF7819',
  	fontSize: 15,
  	lineHeight: 20
  }
})


