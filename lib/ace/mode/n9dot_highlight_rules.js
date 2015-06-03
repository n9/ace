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
    var jsIdent = "[a-zA-Z_$][a-zA-Z0-9_$]*";
	var dotBlockName = "[a-zA-Z_$][a-zA-Z0-9_$/]*";
    var dotParam = ":\\s*" + jsIdent + "\\s*";
    var invalidInnerDot = {
		token : "invalid",
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
			token : "invalid",
			regex : ".+?(?=}})",
			push : [{
				token : "list",
				regex : "}}",
				next : popper(levels + 4)
			}]
		};
    };
    var dotToken = "list";
    var expressionToken = "string";
    var wrapInner = function() {
		return Array.prototype.concat.apply([innerDotComment, invalidInnerDot], arguments);
    };
    var anyContent = function(levels) {
		return wrapInner({
			token : dotToken,
			regex : "}}",
			next : popper(levels + 3)
		}, {
			token : expressionToken,
			regex: ".+?(?={{|}})"
		});
    };
    this.$rules.n9dot = [dotComment(2), { 
		token : "invalid",
		regex : "{{{+|}}+|{{+\\s*}+",
		next : popper(1)
    }, {
        token : dotToken,
        regex : "{{\\s*\\:",
        push : wrapInner({
            token : dotToken,
            regex : "\\s*" + jsIdent + "\\s*=\\s*(?=[^}\\s])",
            push : anyContent(2)
        }, invalidAny(1))
    }, {
        token : "invalid",
        regex : "{{\\s*\\?\\s*#\\s*}}",
        next : popper(1)
    }, {
        token : dotToken,
        regex : "{{\\s*\\?\\s*#(\\s*" + dotBlockName + ")?",
        push : wrapInner({
            token : dotToken,
            regex : "}}",
            next : popper(3)
        }, {
            token : "invalid",
            regex : ":\\s*(?=}})",
        }, {
            token : expressionToken,
            regex : "\\s+|.+?(?=(((" + dotParam + ")?|:)}}|{{))",
        }, {
			token : dotToken,
			regex : "(" + dotParam + ")?}}",
			next : popper(3)
        })
    }, /*{
        token : dotToken,
        regex : "{{\\s*\\?\\??",
        push : [{
            token : dotToken,
            regex : "}}",
            next : pop2
        }, invalidDot, {
            token : expressionToken,
            regex : "\\s*.+?(?=(" + dotParam + ")?}})",
            push : [{
				token : dotToken,
				regex : "(" + dotParam + ")?}}",
				next : pop3
			}, invalidAny]
        }, invalidAny]
    }, {
        token : dotToken,
        regex : "{{\\s*@@",
        push : [{
            token : dotToken,
            regex : "\\s*}}",
            next : pop2
        }, invalidAny]
    }, {
        token : dotToken,
        regex : "{{\\s*@\\s*}}",
    }, {
        token : dotToken,
        regex : "{{\\s*@",
        push : [{
            token : dotToken,
            regex : "}}",
            next : pop2
        }, invalidDot, {
            token : expressionToken,
            regex : "\\s*.+?(?=(" + dotParam + "){1,2}}})",
            push : [{
				token : dotToken,
				regex : "(" + dotParam + "){1,2}}}",
				next : pop3
			}, invalidAny]
        }, invalidAny]
    }, {
        token : dotToken,
        regex : "{{\\s*#(" + dotBlockName + ")?",
        push : [{
            token : dotToken,
            regex : "}}",
            next : pop2
        }, invalidDot, {
            token : expressionToken,
            regex : "\\s*.*?(?=\\.\\s*(" + dotBlockName + "\\s*)?}})",
            push : [{
				token : dotToken,
				regex : "\\.\\s*(" + dotBlockName + "\\s*)?}}",
				next : pop3
			}, invalidAny]
        }, invalidAny]
    }, */{
        token : dotToken,
        regex : "{{\\s*;?",
        push : anyContent(0)
    }];

    this.normalizeRules();
};

oop.inherits(N9dotHighlightRules, HtmlHighlightRules);

exports.N9dotHighlightRules = N9dotHighlightRules;
});
