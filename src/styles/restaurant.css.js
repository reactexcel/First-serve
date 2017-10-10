const RestaurantCss = {
	container: {
		flex: 1,
		backgroundColor: "#000"
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

	rowContainerHCenter: {
		flexDirection:'row',
		justifyContent:'center'
	},

	buttons: {
		backgroundColor: "whitesmoke"
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
		backgroundColor:'#68a0cf',
		borderRadius:20,
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: '#fff'
	},
	submitText:{
		color:'#fff',
		textAlign:'center',
	},
	publish: {
		marginRight:60,
		marginLeft:60,
		marginTop:10,
		paddingTop:10,
		paddingBottom:10,
		backgroundColor:'#fff',
		borderRadius:20,
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: '#fff'
	},
	publishText: {
		color:'#000',
		textAlign:'center',
	},

	bgContainer: {
		flex:1,
		width: null,
		height: null
	},

	bottomBorderBrown: {
		borderBottomWidth: 1,
		borderColor: '#98866F'
	},

	edtText: {
		color:'#98866F'
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
		paddingRight: 8
  },

	rectangle: {
		borderWidth: 1,
		borderColor: '#98866F',
		alignItems:'center',
		justifyContent: 'center'
	}
};

module.exports = RestaurantCss;
