import { Dimensions} from 'react-native'
const { width } = Dimensions.get('window')
import { HEXCOLOR } from './hexcolor';

const AdminCss = {
	container: {
		flex: 1,
		backgroundColor: HEXCOLOR.whiteColor
	},

	rowContainer: {
		flex: 1,
		flexDirection:'row',
		alignItems:'center',
		justifyContent: 'center',
		marginTop:10,
		marginBottom:15
	},

	rowContainerLF: {
		flex: 1,
		flexDirection:'row',
		alignItems:'center',
		paddingBottom: 5
	},

	centerContainer: {
		flex: 1,
		alignItems:'center',
		justifyContent: 'center'
	},

	buttons: {
		backgroundColor: HEXCOLOR.whiteSmoke
	},

	notiView: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
		paddingTop: 7,
		paddingBottom: 10
	},

	listNotiView: {
    flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
		paddingTop: 10
	},

	notiIconView: {
		flexDirection: 'row',
		alignItems: 'center'
	},

	listView: {
			flex: 1,
			paddingBottom:20
	},
	listItem: {
		flex: 1,
		flexDirection:'row',
		alignItems:'center',
		justifyContent: 'center',
		paddingTop:3,
		paddingBottom:10
	},

	listItemTitle: {
		fontWeight:'bold',
		color:'#023e4eff',
		fontSize: 18.8
	},

	submit:{
		marginRight:40,
		marginLeft:40,
		marginTop:10,
		paddingTop:10,
		paddingBottom:10,
		backgroundColor: HEXCOLOR.skyblue,
		borderRadius:20,
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: HEXCOLOR.pureWhite
	},
	submitDisable:{
		marginRight:40,
		marginLeft:40,
		marginTop:10,
		paddingTop:10,
		paddingBottom:10,
		borderRadius:20,
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: HEXCOLOR.lightGrey
	},
  btn:{
		marginLeft:5,
		marginTop:10,
		paddingTop:10,
		paddingBottom:10,
		backgroundColor:HEXCOLOR.skyblue,
		borderRadius:20,
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: HEXCOLOR.pureWhite
	},
	text: {
		paddingTop:10,
		fontSize:21,
		color: 'white'
	},
	navtext:{
		paddingTop:12,
		fontSize:18,
		color: 'white'
	},
	submitText:{
		color: HEXCOLOR.pureWhite,
		textAlign:'center',
	},
	submitTextDisable:{
		color:HEXCOLOR.lightGrey,
		textAlign:'center',
	},

	bgContainer: { flex:1, width: null, height: null },

	bottomBorder: {
		borderBottomWidth: 1
	},

	topBorder: {
		borderTopWidth: 1
	},

	edtText: {
		color: HEXCOLOR.lightBrown
	},

	headingLeft: {
    alignSelf: 'flex-start',
  },

	headingRight: {
    alignSelf: 'flex-end',
  },
	navBar: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: HEXCOLOR.endeavour
  },

  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
		paddingTop:11,
		paddingRight: 12
  },
	circle: {
		width: 40,
		height: 40,
		borderRadius: 20,
		borderWidth: 1,
		alignItems:'center',
		justifyContent: 'center'
	},
	swiperConatiner:{
		flex:1,
		justifyContent: 'center',
		backgroundColor: 'transparent'
	},
	swiperImage: {
			width,
			flex:1
	},
	swiperConatiner:{
		flex:1,
	},
	swiperModal:{
		flex:1,
		marginTop:-8
	},
	headerTitleStyle: {
		alignSelf: 'center',
		color: HEXCOLOR.pureWhite
	},
	adminHeaderStyle:{
		backgroundColor: HEXCOLOR.endeavour,
	},
	headerText: {
		fontSize: 20,
		fontWeight: 'bold'
	},
	bottomNavigation: {
		height: 56,
		elevation: 8,
		position: 'absolute',
		left: 0, bottom: 0,
		right: 0
	},
	shortDescription: {
		color: HEXCOLOR.blueBerry,
		fontSize: 18,
		fontWeight: 'bold',
		paddingTop: 16
	},
	restaurantsImages:{
		color: '#7873B1',
		fontSize: 18,
		fontWeight: 'bold',
	  paddingTop: 16,
		paddingBottom: 10
	},
};

module.exports = AdminCss;
