/* global define */

define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var HtmlHighlightRules = require("./html_highlight_rules").HtmlHighlightRules;

function popper(levels) {
	return function(currentState, stack) {
		stack.splice(0, levels);
		return stack.shift() || "start";
	}
}
var N9dotHighlightRules = function() {
    HtmlHighlightRules.call(this);
    var dot = {
        regex : "(?={{|}})",
        push : "n9dot"
    };
    for (var key in this.$rules) {
        this.$rules[key].unshift(dot);
    }

    var invalidToken = "invalid.n9dotInvalid";
    var dotToken = "list.n9dotToken";
    var expressionToken = "string.n9dotExpression";

    var jsIdent = "[a-zA-Z_$][a-zA-Z0-9_$]*";
	var dotBlockName = "[a-zA-Z_$][a-zA-Z0-9_$/]*";
    var dotParam = ":\\s*" + jsIdent + "\\s*";
    var invalidInnerDot = {
		token : invalidToken,
		regex : "{{+|}}}+"
	};
    var dotComment = function(levels) {
		return {
			token : "comment.start",
			regex : "{{\\*",
			push : [{
				token : "comment.end",
				regex : "\\*}}",
				next : popper(levels + 2)
			}, {
				defaultToken : "comment"
			}]
        };
    };
    var innerDotComment = dotComment(0);
    var invalidAny = function(levels) {
		return {
			token : invalidToken,
			regex : ".+?(?=}}|$)",
			push : [{
				token : dotToken,
				regex : "}}",
				next : popper(levels + 4)
			}, {
				token : invalidToken,
				regex : ".+?(?=}}|$)"
			}]
		};
    };
    var wrapInner = function() {
		return Array.prototype.concat.apply([innerDotComment, invalidInnerDot, {
			token: expressionToken,
			regex: "\\s+"
		}], arguments);
    };
    var invalidMore = function(levels) {
		return [{
			token : dotToken,
			regex : "}}",
			next : popper(levels + 3)
		}, invalidAny(levels)];
    };
    var anyContent = function(levels) {
		return wrapInner({
			token : dotToken,
			regex : "}}",
			next : popper(levels + 3)
		}, {
			token : expressionToken,
			regex: ".+?(?={{|}}|$)"
		});
    };
    var paramContent = function(levels, paramSpec) {
		return wrapInner({
			token : dotToken,
			regex : "(" + dotParam + ")" + paramSpec + "}}",
			next : popper(levels + 2)
		}, {
			token : invalidToken,
			regex : ":\\s*(?=}})",
			push : [{
				token : dotToken,
				regex : "}}",
				next : popper(levels + 3)
			}]
		}, {
			token : expressionToken,
			regex : ".+?(?=(((" + dotParam + ")" + paramSpec + "|:)(}}|{{))|$)",
		}, invalidAny(levels)).filter(function(_) { return _ !== null; });
	};
    this.$rules.n9dot = [dotComment(2), { 
		token : invalidToken,
		regex : "{{{+|}}+|{{+\\s*}+",
		next : popper(1)
    }, {
        token : dotToken,
        regex : "{{\\?#(\\s*" + dotBlockName + ")?",
        push : paramContent(1, "?")
    }, {
        token : dotToken,
        regex : "{{\\?\\??",
        push : paramContent(1, "?")
    }, {
        token : dotToken,
        regex : "{{\\@\\@?}}",
        next : popper(1)
    }, {
        token : dotToken,
        regex : "{{\\@\\@",
        push : [{
			token : dotToken,
			regex : "}}",
			next : popper(2)
		}, {
			token : invalidToken,
			regex : ".+?(?=}}|$)"
	    }]
    }, {
        token : dotToken,
        regex : "{{\\@",
        push : paramContent(1, "{0,3}")
    }, {
        token : dotToken,
        regex : "{{(\\:" + jsIdent + ")?#(" + dotBlockName + "|%)?",
        push : wrapInner({
			token : dotToken,
			regex : "(\\.\\s*(" + dotBlockName + "\\s*)?)?}}",
			next : popper(3)
		}, {
			token : expressionToken,
			regex : ".+?(?=((\\.\\s*(" + dotBlockName + "\\s*)?)?(}}|{{))|$)",
		}, invalidAny(1))
    }, {
        token : dotToken,
        regex : "{{\\.(" + dotBlockName + ")?",
        push : invalidMore(1)
    }, {
        token : dotToken,
        regex : "{{[;:]?",
        push : anyContent(0)
    }];

    this.normalizeRules();
};

oop.inherits(N9dotHighlightRules, HtmlHighlightRules);

exports.N9dotHighlightRules = N9dotHighlightRules;
});
