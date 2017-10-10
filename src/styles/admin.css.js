const AdminCss = {
	container: {
		flex: 1,
		backgroundColor: "#F1F0EC"
	},

	rowContainer: {
		flex: 1,
		flexDirection:'row',
		alignItems:'center',
		justifyContent: 'center',
		paddingBottom: 5
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
		paddingBottom:10
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
		backgroundColor:'#68a0cf',
		borderRadius:20,
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: '#fff'
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
		borderColor: '#626262'
	},
  btn:{
		marginLeft:5,
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
	submitTextDisable:{
		color:'#626262',
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
		color:'#98866F'
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
    backgroundColor: '#122438'
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
		paddingRight: 8
  },
	circle: {
		width: 40,
		height: 40,
		borderRadius: 20,
		borderWidth: 1,
		alignItems:'center',
		justifyContent: 'center'
	}
};

module.exports = AdminCss;
