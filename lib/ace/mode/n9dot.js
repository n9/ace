/* global define */

define(function(require, exports, module) {
  "use strict";

var oop = require("../lib/oop");
var HtmlMode = require("./html").Mode;
var N9dotHighlightRules = require("./n9dot_highlight_rules").N9dotHighlightRules;
var HtmlBehaviour = require("./behaviour/html").HtmlBehaviour;
var HtmlFoldMode = require("./folding/html").FoldMode;

var Mode = function() {
    HtmlMode.call(this);
    this.HighlightRules = N9dotHighlightRules;
    this.$behaviour = new HtmlBehaviour();
    
    this.foldingRules = new HtmlFoldMode();
};

oop.inherits(Mode, HtmlMode);

(function() {
    this.blockComment = {start: "{{*", end: "*}}"};
    this.$id = "ace/mode/n9dot";
}).call(Mode.prototype);

exports.Mode = Mode;
});
