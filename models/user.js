var bcrypt=require('bcrypt');
module.exports=function(sequelize,DataTypes)
{
	return  sequelize.define("users",{
email:{
type:DataTypes.STRING,
allowNull:false,
unique:true,
validate:{
	isEmail:true
}
},salt:{
	type:DataTypes.STRING
},hashed_password:{
	type:DataTypes.STRING
},
password:{
type:DataTypes.VIRTUAL,
allowNull:false,
validate:{
	len:[7,15]
},
set:function(value)
{
	var salt=bcrypt.genSaltSync(10);
	var hashed_password=bcrypt.hashSync(value,salt);
	this.setDataValue('password',value);
	this.setDataValue('salt',salt);
	this.setDataValue('hashed_password',hashed_password);
}
}
},{
	hooks:{
		beforeValidate:function(users,option)
		{
			if(typeof users.email==='string')
			{
				users.email=users.email.toLowerCase();
			}
		}
	}
});
};