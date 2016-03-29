'use strict';

const paramReplacement = '__last__';
const paramUndefined = '__undefined__';

var checkFirstArgumentParamReplacement = arr => {
	if (!(Array.isArray(arr[0]))) {
		arr[0] = [arr[0]];
	}

	return arr[0].indexOf(paramReplacement) === -1;
};

var checkIfItIsFunction = item => {
	if (Array.isArray(item)) {
		if (typeof (item[0]) !== 'function') {
			return false;
		}
	} else {
		if (typeof (item) !== 'function') {
			return false;
		}
	}

	return true;
};

// First function item must not be an array
var functionFactory = (firstArguments, lastProduct, item) => {
	// First one
	if (firstArguments !== null) {
		// [func, arg1, arg2 ...] (X)
		// func                   (O)
		if (Array.isArray(item)) {
			item = item[0];
		}

		// [arg1, arg2, arg3]
		// arg1 -> [arg1]
		if (!(Array.isArray(firstArguments))) {
			firstArguments = [firstArguments];
		}

		return functionFactory(null, paramUndefined, [item].concat(firstArguments));
	}

	// [func ...]
	if (Array.isArray(item)) {
		// [func]
		if (item.length === 1) {
			if (lastProduct === paramUndefined) {
				return item[0].apply(null, []);
			}

			return item[0].apply(null, [lastProduct]);
		}

		// [func, ...,  '__last__', ...]
		if (lastProduct !== paramUndefined) {
			item = item.map(_i => {
				if (_i === paramReplacement) {
					_i = lastProduct;
				}

				return _i;
			});
		}

		// [func, arg1, arg2, arg3] -> ?!
		return item[0].apply(null, item.slice(1));
	}

	// func  (but with middle product `lastProduct`)
	if (lastProduct !== paramUndefined) {
		return item.apply(null, [lastProduct]);
	}

	// func
	return item.apply(null, []);
};

var fp = _body => {
	if (!(checkFirstArgumentParamReplacement(_body))) {
		throw 'first arguments should not include param-replacement' + _body;
	}

	if (!(_body.slice(1).every(checkIfItIsFunction))) {
		throw 'function pipe body is not good!' + _body;
	}

	return (() => {
		let product = functionFactory(_body[0], 'paramUndefined', _body[1]);

		let _bodyLength = _body.length;
		for (let i = 2; i < _bodyLength; i++) {
			product = functionFactory(null, product, _body[i]);

			if (product === undefined) {
				product = paramUndefined;
			}
		}

		return product;
	});
};

module.exports = fp;
