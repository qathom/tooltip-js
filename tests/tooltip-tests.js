"use strict";
var sinon = require('sinon');
var TestUtils = require('test-utils');
var Tooltip = require('../src/tooltip');
var assert = require('assert');
import Promise from 'promise';
import Module from 'module-js';

describe('Tooltip', function () {

    var el;

    before(function () {
        el = document.createElement('div');
        el.className = 'container';
        el.innerHTML = '<span class="ui-tooltip-trigger"></span><div class="ui-tooltip-panel"></div>';
    });

    after(function () {
        el = null;
    });

    beforeEach(function () {
        sinon.stub(Module.prototype, 'show').returns(Promise.resolve());
        sinon.stub(Module.prototype, 'hide').returns(Promise.resolve());
        sinon.stub(Module.prototype, 'destroy');
    });

    afterEach(function () {
        Module.prototype.show.restore();
        Module.prototype.hide.restore();
        Module.prototype.destroy.restore();
    });

    it('should show and hide programmatically', function() {
        var activeClass = 'ui-tooltip-active';
        var tooltip = new Tooltip({el: el, activeClass: activeClass});
        assert.ok(!el.classList.contains(activeClass), 'tooltip active class does not exist initially');
        assert.ok(!tooltip.isActive(), 'isActive() is falsy');
        tooltip.show();
        assert.ok(el.classList.contains(activeClass), 'tooltip active class was added when calling show method');
        assert.ok(tooltip.isActive(), 'isActive() is truthy');
        tooltip.hide();
        assert.ok(!el.classList.contains(activeClass), 'tooltip active class was removed when calling hide method');
        assert.ok(!tooltip.isActive(), 'isActive() is falsy');
        tooltip.destroy();
    });

    it('should show and hide when trigger is clicked', function() {
        var showSpy = sinon.spy(Tooltip.prototype, 'show');
        var showCallCount = 0;
        var hideSpy = sinon.spy(Tooltip.prototype, 'hide');
        var hideCallCount = 0;
        var triggerClass = 'ui-tooltip-trigger';
        var tooltip = new Tooltip({el: el, showEvent: 'click', hideEvent: 'click', triggerClass: triggerClass});
        var trigger = el.getElementsByClassName(triggerClass)[0];
        var panel = el.getElementsByClassName('ui-tooltip-panel')[0];
        assert.equal(showSpy.callCount, showCallCount, 'show method was NOT fired on init');
        assert.equal(hideSpy.callCount, hideCallCount, 'hide method was NOT fired on init');

        trigger.dispatchEvent(TestUtils.createEvent('click'));
        showCallCount++;
        assert.equal(showSpy.callCount, showCallCount, 'show method was fired after first click on trigger');
        assert.equal(hideSpy.callCount, hideCallCount, 'hide method was NOT called');
        trigger.dispatchEvent(TestUtils.createEvent('click'));
        hideCallCount++;
        assert.equal(hideSpy.callCount, hideCallCount, 'hide method was fired after second click on trigger');
        assert.equal(showSpy.callCount, showCallCount, 'show method was NOT called');
        tooltip.destroy();
        trigger.dispatchEvent(TestUtils.createEvent('click'));
        assert.equal(hideSpy.callCount, hideCallCount, 'hide method was NOT fired after destroy');
        assert.equal(showSpy.callCount, showCallCount, 'show method was NOT fired');
        showSpy.restore();
        hideSpy.restore();
    });

    it('should NOT show and hide when no event options are specified', function() {
        var showSpy = sinon.spy(Tooltip.prototype, 'show');
        var hideSpy = sinon.spy(Tooltip.prototype, 'hide');
        var triggerClass = 'ui-tooltip-trigger';
        var tooltip = new Tooltip({el: el, triggerClass: triggerClass});
        var trigger = el.getElementsByClassName(triggerClass)[0];
        var panel = el.getElementsByClassName('ui-tooltip-panel')[0];
        trigger.dispatchEvent(TestUtils.createEvent('click'));
        assert.equal(showSpy.callCount, 0, 'show method was NOT fired after click on trigger because no event was specified in init option');
        assert.equal(hideSpy.callCount, 0, 'hide method was NOT called');
        tooltip.destroy();
        showSpy.restore();
        hideSpy.restore();
    });

    it('should fire callback functions when showing and hiding', function() {
        var onShowSpy = sinon.spy();
        var onHideSpy = sinon.spy();
        var tooltip = new Tooltip({el: el, onShow: onShowSpy, onHide: onHideSpy});
        tooltip.show();
        assert.equal(onShowSpy.callCount, 1, 'onShow callback is fired when tooltip shows');
        tooltip.hide();
        assert.equal(onHideSpy.callCount, 1, 'onHide callback is fired when tooltip hides');
        tooltip.destroy();
    });

    it('should show and hide on hover', function() {
        var showSpy = sinon.spy(Tooltip.prototype, 'show');
        var showCallCount = 0;
        var hideSpy = sinon.spy(Tooltip.prototype, 'hide');
        var hideCallCount = 0;
        var triggerClass = 'ui-tooltip-trigger';
        var tooltip = new Tooltip({
            el: el,
            showEvent: 'mouseenter',
            hideEvent: 'mouseleave',
            triggerClass: triggerClass
        });
        var trigger = el.getElementsByClassName(triggerClass)[0];
        var panel = el.getElementsByClassName('ui-tooltip-panel')[0];
        assert.equal(showSpy.callCount, showCallCount, 'show method was NOT fired on init');
        assert.equal(hideSpy.callCount, hideCallCount, 'hide method was NOT fired on init');
        trigger.dispatchEvent(TestUtils.createEvent('mouseenter'));
        showCallCount++;
        assert.equal(showSpy.callCount, showCallCount, 'show method was fired after hovering on trigger');
        assert.equal(hideSpy.callCount, hideCallCount, 'hide method was NOT called');
        trigger.dispatchEvent(TestUtils.createEvent('mouseleave'));
        hideCallCount++;
        assert.equal(hideSpy.callCount, hideCallCount, 'hide method was fired after mouse stops hovering trigger');
        assert.equal(showSpy.callCount, showCallCount, 'show method was NOT called');
        tooltip.destroy();
        showSpy.restore();
        hideSpy.restore();
    });

    it('should return Module\'s show() method when calling show()', function() {
        Module.prototype.show.returns(Promise.resolve());
        var tooltip = new Tooltip({el: el});
        return tooltip.show().then(function () {
            assert.equal(Module.prototype.show.callCount, 1);
            tooltip.destroy();
        });
    });

    it('should return Module\'s hide() method when calling hide()', function() {
        Module.prototype.hide.returns(Promise.resolve());
        var tooltip = new Tooltip({el: el});
        return tooltip.hide().then(function () {
            assert.equal(Module.prototype.hide.callCount, 1);
            tooltip.destroy();
        });
    });

    it('should return Module\'s destroy() method when calling destroy()', function() {
        Module.prototype.destroy.returns(Promise.resolve());
        var tooltip = new Tooltip({el: el});
        tooltip.destroy();
        assert.equal(Module.prototype.destroy.callCount, 1);
    });

});
