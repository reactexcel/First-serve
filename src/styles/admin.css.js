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
		borderWidth: 1,
		borderColor: '#fff'
	},
  btn:{
		marginLeft:5,
		marginTop:10,
		paddingTop:10,
		paddingBottom:10,
		backgroundColor:'#68a0cf',
		borderRadius:20,
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

	edtText: {
		color:'#98866F'
	},

	headingLeft: {
    alignSelf: 'flex-start',
  },

	headingRight: {
    alignSelf: 'flex-end',
  }
};

module.exports = AdminCss;
