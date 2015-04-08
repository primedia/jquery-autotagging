var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

define(['jquery'], function($) {
  var ClickHandler;
  ClickHandler = (function() {
    function ClickHandler(wh1, opts) {
      this.wh = wh1;
      if (opts == null) {
        opts = {};
      }
      this.elemClicked = bind(this.elemClicked, this);
      this.clickBindSelector = opts.clickBindSelector || 'a, input[type=submit], input[type=button], img';
      this.dataAttributePrefix = opts.dataAttributePrefix || 'autotag';
      if (opts.exclusions != null) {
        this.clickBindSelector = this.clickBindSelector.replace(/,\s+/g, ":not(" + opts.exclusions + "), ");
      }
    }

    ClickHandler.prototype.bind = function(elem) {
      return $(elem).on('click', this.clickBindSelector, this.elemClicked);
    };

    ClickHandler.prototype._shouldRedirect = function(href) {
      return (href != null) && (href.indexOf != null) && href.indexOf('javascript:') === -1;
    };

    ClickHandler.prototype._followHrefConfigured = function(event, options, wh) {
      var ref, ref1;
      if ((event != null ? (ref = event.data) != null ? ref.followHref : void 0 : void 0) != null) {
        return event != null ? (ref1 = event.data) != null ? ref1.followHref : void 0 : void 0;
      } else if ((options != null ? options.followHref : void 0) != null) {
        return options != null ? options.followHref : void 0;
      } else if ((wh != null ? wh.followHref : void 0) != null) {
        return wh != null ? wh.followHref : void 0;
      } else {
        return false;
      }
    };

    ClickHandler.prototype._setDocumentLocation = function(href) {
      return document.location = href;
    };

    ClickHandler.prototype._openNewWindow = function(href) {
      return window.open(href);
    };

    ClickHandler.prototype.elemClicked = function(e, options) {
      var attr, attrs, domTarget, i, item, jQTarget, len, realName, ref, subGroup, trackingData, value;
      if (options == null) {
        options = {};
      }
      domTarget = e.target;
      attrs = domTarget.attributes;
      jQTarget = $(e.target);
      if (!jQTarget.is(this.clickBindSelector)) {
        jQTarget = jQTarget.parent();
      }
      item = this.wh.getItemId(jQTarget) || '';
      subGroup = this.wh.getSubgroupId(jQTarget) || '';
      value = this.wh.replaceDoubleByteChars(jQTarget.data(this.dataAttributePrefix + "-value") || jQTarget.text()) || '';
      trackingData = {
        sg: subGroup,
        item: item,
        value: value,
        type: 'click',
        x: e.clientX,
        y: e.clientY
      };
      for (i = 0, len = attrs.length; i < len; i++) {
        attr = attrs[i];
        if (attr.name.indexOf('data-') === 0 && (ref = attr.name, indexOf.call(this.wh.exclusionList, ref) < 0)) {
          realName = attr.name.replace('data-', '');
          trackingData[realName] = attr.value;
        }
      }
      return this.wh.fire(trackingData);
    };

    return ClickHandler;

  })();
  return ClickHandler;
});