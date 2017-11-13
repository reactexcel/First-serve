import { HEXCOLOR } from './hexcolor';

const Common = {
	container: {
		flex: 1,
		backgroundColor: HEXCOLOR.whiteColor
	},

	midContainer: {
		flex: 1,
		alignItems:'center',
		justifyContent: 'center',
	},

	rowContainer: {
		flexDirection:'row',
		alignItems:'center',
		justifyContent: 'center',
		paddingBottom: 5
	},

	headerText: {
		fontSize: 20,
		fontWeight: 'bold'
	},

	rowContainerLF: {
		flex: 1,
		flexDirection:'row',
		alignItems:'center',
		paddingBottom: 5
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

	listView: {
			flex: 1,
			paddingBottom:20
	},

	listItem: {
		flex: 1,
		flexDirection:'row',
		alignItems:'center',
		justifyContent: 'center',
		padding:20
	},

	listItemTitle: {
		fontSize: 20
	},

	submit:{
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
		color: HEXCOLOR.pureWhite,
		textAlign:'center',
	},
	bgContainer: { flex:1, width: null, height: null },

	bottomBorder: {
		borderBottomColor:'#023e4eff',
		borderBottomWidth: 0.5
	},

	bottomTopBorder: {
		borderTopColor:'#023e4eff',
		borderBottomColor:'#023e4eff',
		borderTopWidth: 0.5,
		borderBottomWidth: 0.5
	},

	edtText: {
		color: HEXCOLOR.lightBrown
	},

	navBar: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

	headingLeft: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-start',
  },

	headingRight: {
		flex: 1,
		paddingTop:8,
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		paddingRight: 8
  },

	avtarCircle: {
		width: 95,
		height: 95,
		borderRadius: 55,
		alignItems:'center',
		justifyContent: 'center',
		overflow: 'hidden'
	}
};

module.exports = Common;
