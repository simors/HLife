import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'

export default THEME = {
	base: {
		color: '#030303',
		linkColor: '#50E3C2',
		backgroundColor: '#fff',
		fontSize: {
			base: em(14),
			large: em(18),
			small: em(11)
		},
		input: {
			height: normalizeH(50),
			paddingLeft: normalizeW(10),
			paddingRight: normalizeW(10),
			backgroundColor: '#F3F3F3',
			borderWidth: normalizeBorder(),
    	borderColor: '#E9E9E9',
    	fontSize: em(16),
    	color: '#B2B2B2'
		},
		inputContainer: {
			marginLeft: 0,
	    marginRight: 0,
	    marginBottom: 0,
	    marginTop: 0,
	    borderBottomWidth: 0,
			paddingLeft: normalizeW(17),
			paddingRight: normalizeW(17),
		}
	},
	colors: {
		white: '#fff',
		black: '#000',
		dark: '#636363',
		light: '#B2B2B2',
		lighter: '#B5B5B5',
		green: '#50E3C2',
    gray: '#929292',
    subDark: '#232323',
		inputLabel: '#656565',
		red: '#F24016'
	},
}