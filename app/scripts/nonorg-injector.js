const extension = require('extensionizer')

/**
 * NonOrg Widgets Injector
 */
const NonOrgInjector = {

    _widgets: [],

    pushTransaction: function (txParams, widgetContext) {
        extension.runtime.sendMessage({
            action: 'nonorg-widget-clicked',
            txParams,
            widgetContext
        })
    },

    init: async function () {
        var me = this;

        const widgetListUrl = 'https://skillunion.github.io/metamask-extension-static/domains/' + window.location.hostname + '.json';
        const widgetListResponse = await fetch(widgetListUrl)

        if (!widgetListResponse.ok) {
            console.warn('Widget Injector: Widget list loading error');
            return;
        }

        const widgetListParsed = await widgetListResponse.json()

        if (widgetListParsed == null || widgetListParsed.widgets == null || widgetListParsed.widgets.length == 0) {
            console.warn('Widget Injector: Available widgets not found');
            return;
        }

        for (var i = 0; i < widgetListParsed.widgets.length; i++) {
            var widgetInfo = widgetListParsed.widgets[i];
            if (!widgetInfo.url || !widgetInfo.hash) return;

            const widgetResponse = await fetch(widgetInfo.url);
            const widgetText = await widgetResponse.text();
            // TODO: Check hash
            const widget = eval(widgetText);
            me._widgets.push(widget);
        }
        
        if (me._widgets.length == 0) {
            console.warn('Widget Injector: Available widgets not found');
            return;
        }

        console.log('Widget Injector: %s widget(s) was loaded', me._widgets.length);

        document.addEventListener("DOMContentLoaded", function() {
            for (var i = 0; i < me._widgets.length; i++) {
                try {
                    me._widgets[i].init(document, me.pushTransaction);
                } catch (e) {
                    console.log('Widget Injector: Widget loading error', e);
                }
            }
        });
    }
}

module.exports = NonOrgInjector