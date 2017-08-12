/**
 * Created by lilu on 2017/7/24.
 */
import React, {Component} from 'react';
import SvgUri from './react-native-svg-uri/index';
import svgs from '../../assets/svgs';

export default class Svg extends Component {
  render() {
    const {
      iocn,
      color,
      size,
      style,
      width,
      height,
    } = this.props;
    let svgXmlData = svgs[this.props.icon];

    if (!svgXmlData) {
      let err_msg = `没有"${this.props.icon}"这个icon`;
      throw new Error(err_msg);
    }
    return (
      <SvgUri
        width={width?width:size}
        height={height?height:size}
        svgXmlData={svgXmlData}
        fill={color}
        style={[style,{alignItems: 'center',justifyContent: 'center'}]}
      />
    )
  }
}