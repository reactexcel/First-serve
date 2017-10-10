const Common = {
	container: {
		flex: 1,
		backgroundColor: "#F1F0EC"
	},

	rowContainer: {
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
	bgContainer: { flex:1, width: null, height: null },

	bottomBorder: {
		borderBottomWidth: 1
	},

	bottomTopBorder: {
		borderTopWidth: 1,
		borderBottomWidth: 1
	},

	edtText: {
		color:'#98866F'
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
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		paddingRight: 8
  },

	avtarCircle: {
		width: 80,
		height: 80,
		borderRadius: 40,
		borderWidth: 1,
		alignItems:'center',
		justifyContent: 'center',
		overflow: 'hidden'
	}
};

module.exports = Common;
