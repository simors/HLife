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
 import {em, normalizeW, normalizeH, normalizeBorder} from '../../../util/Responsive'
 import Popup from '@zzzkk2009/react-native-popup'
 import * as Toast from '../../common/Toast'
 import CommonButton from  '../../common/CommonButton'
 import * as AVUtils from '../../../util/AVUtils'

 const PAGE_WIDTH = Dimensions.get('window').width
 const PAGE_HEIGHT = Dimensions.get('window').height

class HowGetInvitationCode extends Component {
	constructor(props) {
		super(props)
	}

	componentWillMount() {
		InteractionManager.runAfterInteractions(()=>{
			
		})
	}


	render() {

    return (
    	<View style={styles.container}>
    		<Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="邀请码获取方式"
          headerContainerStyle={styles.headerContainerStyle}
          leftStyle={styles.headerLeftStyle}
          titleStyle={styles.headerTitleStyle}
          rightType="none"
        />

				<View style={styles.body}>
					<ScrollView>
						
						<View style={styles.contentWrap}>
							<Text style={styles.lineText}>尊敬的用户：</Text>
							<Text style={styles.lineText}>欢迎加入汇邻优店店铺平台，为了保障店铺信息的真实有效，共建良好的店铺运营环境，店铺入驻必须由平台推广人员发出邀请才能注册。</Text>
							<Text style={styles.lineText}>您可以通过以下方式找到平台推广人员：</Text>
							<Text style={styles.lineText}>1. 身边认识的已加入汇邻优店推广联盟的成员</Text>
							<Text style={styles.lineText}>2. 在本app中找到有推广员身份的邻友</Text>
							<Text style={[styles.lineText, {fontWeight:'bold'}]}>点击个人头像进入的个人信息页面，头像下方有以下身份标识均具备生成邀请码资格，您可以通过私信与他沟通获取邀请码</Text>
							<Text style={[styles.lineText, {marginTop: 30,marginBottom: 30}]}>
								若仍有疑问，请
								<Text onPress={()=>{}} style={{color: '#ff7819'}}>联系客服</Text>
							</Text>

							<View style={{backgroundColor:'rgba(255, 157, 78, 0.08)',borderRadisu:6,padding:10,marginBottom:25}}>
								<Text style={{fontSize:15,color:'#5a5a5a'}}>点击个人头像 -> 个人信息详情</Text>
								<View style={{flex: 1,flexDirection:'row',justifyContent:'center',marginBottom:12,marginTop:18}}>
									<View style={{flex:1,justifyContent:'center', alignItems: 'center'}}>
										<Image style={{width:27,height:27}} source={AVUtils.getPromoterLevelInfo(1).levelMainIcon}/>
									</View>
									<View style={{flex:1,justifyContent:'center', alignItems: 'center'}}>
										<Image style={{width:27,height:27}} source={AVUtils.getPromoterLevelInfo(2).levelMainIcon}/>
									</View>
									<View style={{flex:1,justifyContent:'center', alignItems: 'center'}}>
										<Image style={{width:27,height:27}} source={AVUtils.getPromoterLevelInfo(3).levelMainIcon}/>
									</View>
									<View style={{flex:1,justifyContent:'center', alignItems: 'center'}}>
										<Image style={{width:27,height:27}} source={AVUtils.getPromoterLevelInfo(4).levelMainIcon}/>
									</View>
									<View style={{flex:1,justifyContent:'center', alignItems: 'center'}}>
										<Image style={{width:27,height:27}} source={AVUtils.getPromoterLevelInfo(5).levelMainIcon}/>
									</View>
								</View>
								<View style={{alignItems:'center'}}>
									<Text style={{fontSize:15,color:'#5a5a5a'}}>推广员身份标识</Text>
								</View>
							</View>

							<CommonButton
                onPress={() => {Actions.MYATTENTION()}}
                title="找邻友"
              />
						</View>

					</ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(HowGetInvitationCode)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white'
	},
	body: {
		marginTop: normalizeH(64),
    flex: 1,
  },
  contentWrap: {
  	padding: 15
  },
  lineText: {
  	fontSize: 17,
  	color: '#5a5a5a',
  	lineHeight: 25
  }
  
})


