module.exports=function(sequelize,DataTypes)
{
return sequelize.define("todos",{
description:{
type:DataTypes.STRING,
allowNull:false,
validate:{
	len:[5,25]
}
},
completed:{
type:DataTypes.BOOLEAN,
allowNull:false,
defaultValue:false
}
});
};