var _ = require('underscore');

// Value OK Type
var vokT = function(obj,expectedtype,debug) {
	
	var ret = true;	
	// Underscore JS function
	var functionname = 'is' + expectedtype.charAt(0).toUpperCase() + expectedtype.slice(1);

	if(typeof _[functionname] === "function") { 
		if(!_[functionname](obj)) {
			if(debug) {
				console.log('TYPE FAIL - IS NOT ' + expectedtype);
			}
			ret = false;
		}	
	} else {
		if(debug) {
			console.log('UNKNOWN OBJECT TYPE TEST REQUEST - ' + expectedtype);
			console.log('UNDERSCORE JS HAS NO ' + functionname + ' FUNCTION');
		}
		ret = false;
	}	
	
	return ret;

}

// Value OK
var vok = function(obj,expectedpath,expectedtype,debug) {

	if(_.isUndefined(debug) || debug !== true) {
		var debug = false;
	} 		

	var ret = true;	
	if(!_.isUndefined(expectedtype)) {
		expectedtype = expectedtype.toLowerCase();
	}
	
	if(!_.isUndefined(obj) && _.isObject(obj) && !_.isUndefined(expectedpath) && _.isString(expectedpath)) {
	
		var subobj = {};
		
		// If the expected path contains any array keys like so :
		// testme.thingy[1].thongy
		// we first need to convert these to look like :
		// testme.thingy.1.thongy
		expectedpath = expectedpath.replace(']','');
		expectedpath = expectedpath.replace('[','.');
		
		// Catch and kill any double dots
		expectedpath = expectedpath.replace(/\.{2,}/g, '.');
					
		var path = expectedpath.split('.');
		
		if(_.isArray(path)) {

			var first = true;
			var fail = false;
			var objrec = obj;			
			var fullpath = [];

			path.forEach(function(elem) {
				if(ret) {				
					if(!first) {
						fullpath.push(elem);
						if(!_.isUndefined(objrec[elem])) {
							// Only last element in chain is permitted to be null
							if(fullpath.length == (path.length - 1)) {
								
								objrec = objrec[elem];
								
								if(debug) {
									console.log('OBJECT AT END OF ' + fullpath + ' CHAIN IS',objrec);		
								}						
								
								if(!_.isUndefined(expectedtype)) {
									ret = vokT(objrec,expectedtype,debug);
								}
											
							} else {					
								if(!_.isNull(objrec[elem])) {										
									objrec = objrec[elem];						
								} else {
									if(debug) {
										console.log('OBJECT FAIL ON ',fullpath);
									}
									ret = false;	
								}
							}		
						} else {					
							if(debug) {
								console.log('OBJECT FAIL ON ',fullpath);
							}
							ret = false;	
						}
					} else {
						// First part of path assumed to be object itself...
						first = false;
					}					
				}		
			});		
		
		}
		
	} else {
	
		ret = false;
		
	}
	
	return ret;

}

module.exports = {
  vok: vok
};
