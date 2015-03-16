## Introduction

Writing defensive code in Javascript is good practice. But checking that an object/item exists before operating on it, checking if it's undefined, null, the expected type or something else (repeatedly) before even doing anything is boring.
This is where the ever dependable Underscore.JS is a great time saver. But even though that gives you a fantastic arsenal of validation tools, you may still have to combine multiple function calls to confirm the existence of an otherwise expected object and it's type. 
That gets boring, so I produced vok (Value OK?), to do just this (piggybacking off Underscore.JS) but in one function call.

## Installation

```                                                       
  npm install vok
```

## Usage

``` 
vok([OBJECT TO TEST],[PATH TO TEST],[EXPECTED TYPE OF LAST CHILD],[DEBUG?]);
```

vok accepts 4 simple parameters. The last two are entirely optional!

 * **[OBJECT TO TEST]** should be replaced with an object you want to validate.
 * **[PATH TO TEST]** should be a string of the path through the object you want to test exists.
 * **[EXPECTED TYPE OF LAST CHILD]** - optional! If you're expecting the very end of your tested path to be an array, null, number... whatever, you can have this checked for also! If there's an equivalent Underscore.JS 'is' test for it, then you should be able to define a type to check to match (e.g 'null' effectively calls the _.isNull function, 'array' calls _.isArray etc. etc.) 
 * **[DEBUG?]** - optional! False by default, if you specify true then additional information about any failing tests will be console log'ed for your perusal.

Here's a typical use case. Imagine you have an object that looks like this :

``` 
var testme = {
	thingy: {
		thongy: {
			wibble: null,
			wobble: [1,2,3]
		}
	}
}
```

...and you want to update the value of 'wibble'. Being super-defensive and using Underscore.JS you would check that each stage in the object actually exists, and that 'wibble' was the null value you were expecting like :

```
if(!_.isUndefined(testme.thingy) && !_.isUndefined(testme.thingy.thongy) && !_.isUndefined(testme.thingy.thongy.wibble) && _.isNull(testme.thingy.thongy.wibble)) {
	testme.thingy.thongy.wibble = 123;
}
```

All that validation simply confirms that the testme object matches the structure assumed, because if you attempted to work with a value like 'testme.thingy.thingy.wibble' and this path structure was different, your app may crash. 
vok compresses this into the shorthand of :

``` 
if(vok(testme,'testme.thingy.thongy.wibble','null')) {
	testme.thingy.thingy.wibble = 123;
}
```

Given the testme object, and a structured path you'd like to confirm is legit, this will validate the presence of each stage in the given path, and then with the optional third parameter check that the item at the end of this path matches the given type. In this case, it's confirming that the wibble element = null.

Does it work with arrays? You betcha!

``` 
if(vok(testme,'testme.thingy.thongy.wobble[2]')) {
	testme.thingy.thingy.wobble[2] = 99;
}
```

