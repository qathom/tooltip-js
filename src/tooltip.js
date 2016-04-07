'use strict';
import _ from 'lodash';
import Module from 'module-js';

/**
 * Tooltip.
 * @class Tooltip
 */
class Tooltip extends Module {

    /**
     * When instantiated.
     * @param {object} options - Options to pass
     * @param {HTMLElement} options.el - The container of the tooltip
     * @param {string} [options.showEvent] - A string indicating which event should trigger showing the tooltip
     * @param {string} [options.hideEvent] - A string indicating which event should trigger hiding the tooltip
     * @param {Function} [options.onShow] - A callback function that fires when tooltip panel is shown
     * @param {Function} [options.onHide] - A callback function that fires when tooltip panel is hidden
     * @param {string} [options.activeClass] - A custom css class that will be applied when the toggle is shown and removed when hidden
     * @param {string} [options.triggerClass] - A custom css class that will be used to query all elements that will trigger a show/hide toggle on tooltip
     */
    constructor (options) {

        options = _.extend({
            el: null,
            showEvent: null,
            hideEvent: null,
            onShow: null,
            onHide: null,
            activeClass: 'tooltip-active',
            triggerClass: 'tooltip-trigger'
        }, options);

        super(options.el, options);

        this.options = options;
        this.el = options.el;
        this.trigger = options.el.getElementsByClassName(this.options.triggerClass)[0];

        // setup events if needed
        if (options.showEvent) {
            this.eventMap = this._setupEvents(options.showEvent, options.hideEvent);
        }

    }

    /**
     * Sets up events for showing/hiding tooltip.
     * @deprecated since 1.1.0
     */
    setup () {}

    /**
     * Sets up events.
     * @param {string} showEvent - The event string to hide tooltip
     * @param {string} hideEvent - The event string to show tooltip
     * @returns {object} - Returns a mapping of all events to their trigger functions.
     * @private
     */
    _setupEvents (showEvent, hideEvent) {
        var map = this._buildEventMap(showEvent, hideEvent),
            key,
            e;
        for (key in map) {
            if (map.hasOwnProperty(key)) {
                e = map[key];
                this.trigger.addEventListener(e.name, e.event);
            }
        }
        return map;
    }

    /**
     * Fires when the show and hide events are the same and we need to determine whether to show or hide.
     * @private
     */
    _onDuplicateEvent () {
        if (this.isActive()) {
            this.hide();
        } else {
            this.show();
        }
    }


    /**
     * Builds the event map.
     * @param {string} showEvent - The event string to hide tooltip
     * @param {string} hideEvent - The event string to show tooltip
     * @returns {object} - Returns a mapping of all events to their trigger functions.
     * @private
     */
    _buildEventMap (showEvent, hideEvent) {
        var map = {};

        if (showEvent === hideEvent) {
            // show event and hide events are the same
            map['showEvent'] = {
                name: showEvent,
                event: this._onDuplicateEvent.bind(this)
            };
            return map;
        }

        if (showEvent) {
            map['showEvent'] = {
                name: showEvent,
                event: this.show.bind(this)
            }
        }
        if (hideEvent) {
            map['hideEvent'] = {
                name: hideEvent,
                event: this.hide.bind(this)
            }
        }
        return map;
    }

    /**
     * Shows the tooltip.
     * @returns {Promise}
     */
    show () {
        this.el.classList.add(this.options.activeClass);
        if (this.options.onShow) {
            this.options.onShow();
        }
        return super.show();
    }

    /**
     * Hides the tooltip.
     * @returns {Promise}
     */
    hide () {
        this.el.classList.remove(this.options.activeClass);
        if (this.options.onHide) {
            this.options.onHide();
        }
        return super.hide();
    }

    /**
     * Checks whether tooltip is showing.
     * @returns {boolean} Returns true if showing
     */
    isActive () {
        return this.el.classList.contains(this.options.activeClass);
    }

    /**
     * Destruction of this class.
     */
    destroy () {
        var eventMap = this.eventMap,
            key,
            e;

        // destroy events
        if (eventMap) {
            for (key in eventMap) {
                if (eventMap.hasOwnProperty(key)) {
                    e = eventMap[key];
                    this.trigger.removeEventListener(e.name, e.event);
                }
            }
        }
        super.destroy();
    }

}

module.exports = Tooltip;
