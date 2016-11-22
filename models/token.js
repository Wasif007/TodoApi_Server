var cryptojs=require('crypto-js');
module.exports=function(sequelize,DataType){
	return sequelize.define('token',{
		token:{
			type:DataType.VIRTUAL,
			allowNull:false,
			validate:{
				len:[1]
			},
			set:function(value)
			{
				var hash=cryptojs.MD5(value).toString();

				this.setDataValue('token',value);
				this.setDataValue('hashtoken',hash);
			}
		},
		hashtoken:{
			type:DataType.STRING
		}
	});
};