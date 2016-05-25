var isObject = function(variable){
    if (typeof variable === 'object' && !Array.isArray(variable)){
        return true;
    }
    else return false;
};

var findValueOfObjectParameter = function(object, parameterName){
    var result;
    for (var parameter in object){
    	if (result) return result; // stop itteration
        if (parameter === parameterName){
            return object[parameter];
        }
        else if (isObject(object[parameter])){ // the parameter's value is object
            result = findValueOfObjectParameter(object[parameter], parameterName);
        }
        else if (Array.isArray(object[parameter])){ // the parameter's value is array
            for (var i in object[parameter]){
                if (isObject(object[parameter][i])){
                    result = findValueOfObjectParameter(object[parameter][i], parameterName);
                }
            }
        }
    }
    return result;
};

module.exports = {'isObject': isObject, 'findValueOfObjectParameter': findValueOfObjectParameter};