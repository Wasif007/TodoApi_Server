var bcrypt=require('bcrypt');
var _=require('underscore');
var cryptojs=require("crypto-js");
var jwt=require('jsonwebtoken');
module.exports=function(sequelize,DataTypes)
{
	var user=  sequelize.define("users",{
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
	},
	instanceMethods:{
		toPublicJson:function()
		{
			var json=this.toJSON();
			return _.pick(json,"id","email","createdAt","updatedAt");
		},
		generateToken:function(type)
		{
			if(!_.isString(type))
			{
			return	undefined;
			}
			try{
				var stringdata=JSON.stringify({id:this.get('id'),type:type});
				var encrypted=cryptojs.AES.encrypt(stringdata,"abc").toString();
				var tokendata=jwt.sign({
					token:encrypted
				},"xyz");
				return tokendata;
			}catch(e)
			{
				return undefined;
			}
		}
	},
	classMethods:{
		findByToken:function(token){
			return new Promise(function(response,reject){
				
				try{var tokengetting=jwt.verify(token,"xyz");
				var bytes=cryptojs.AES.decrypt(tokengetting.token,"abc");
				var dataObtained=JSON.parse(bytes.toString(cryptojs.enc.Utf8));

				user.findById(dataObtained.id).then(function(user){
					if(user)
					{
						response(user);
					}
					else{
						reject();
					}
				},function(){

					reject();
				});
			}
			catch(e)
			{

				reject();
			}

});
		},
		Authenticate:function(body)
		{
			return new Promise(function(response,reject){
if(typeof body.email!=='string' || typeof body.password!=='string')
{
	return reject();
}
user.findOne({
	where:
	{
	email:body.email}
}).then(function(user){
	if(!user || !bcrypt.compareSync(body.password,user.get('hashed_password')))
	{
	return	reject();
	}
	return response(user);
},function(e){
	reject();
});
			});
		
		}
	}
});
	return user;
};