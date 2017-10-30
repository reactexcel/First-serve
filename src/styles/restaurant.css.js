import { HEXCOLOR } from './hexcolor';
const RestaurantCss = {
	container: {
		flex: 1,
		backgroundColor: 'white'
	},

	rowContainer: {
		flex: 1,
		flexDirection:'row',
		alignItems:'center',
		justifyContent: 'center',
		paddingBottom: 5
	},

	rowContainerLF: {
		flexDirection:'row',
		alignItems:'center',
		paddingBottom: 5
	},

	headerText: {
		fontSize: 20,
		fontWeight: 'bold'
	},

	navBar: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: HEXCOLOR.lightBrown
  },

	rowContainerHCenter: {
		flexDirection:'row',
		justifyContent:'center'
	},

	buttons: {
		backgroundColor:  HEXCOLOR.whiteSmoke
	},

	notiView: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
		paddingTop: 10,
		paddingBottom: 10
	},

	listNotiView: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
		paddingTop: 10,
		paddingBottom: 40
	},

	notiIconView: {
		flexDirection: 'row',
		alignItems: 'center'
	},

	listItem: {
		flex: 1,
		flexDirection:'row',
		alignItems:'center',
		justifyContent: 'center',
		paddingRight: 8
	},

	listItemTitle: {
		fontSize: 20
	},

	submit: {
		marginRight:40,
		marginLeft:40,
		marginTop:10,
		paddingTop:10,
		paddingBottom:10,
		backgroundColor:HEXCOLOR.skyblue,
		borderRadius:20,
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: HEXCOLOR.pureWhite
	},
	submitText:{
		color:HEXCOLOR.pureWhite,
		textAlign:'center',
	},
	publish: {
		marginRight:60,
		marginLeft:60,
		marginTop:10,
		paddingTop:10,
		paddingBottom:10,
		backgroundColor:HEXCOLOR.pureWhite,
		borderRadius:20,
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: HEXCOLOR.pureWhite
	},
	publishText: {
		color: HEXCOLOR.black ,
		textAlign:'center',
	},

	bgContainer: {
		flex:1,
		width: null,
		height: null
	},

	bottomBorderBrown: {
		borderBottomWidth: 2,
		borderColor: '#023e4eff'
	},

	edtText: {
		color:HEXCOLOR.lightBrown
	},

	headingLeft: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-start',
  },

	headingRight: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		marginRight: 8
  },

	rectangle: {
		borderWidth: 1,
		borderColor: '#023e4eff',
		alignItems:'center',
		justifyContent: 'center'
	}
};

module.exports = RestaurantCss;
