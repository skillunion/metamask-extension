const extension = require('extensionizer')

/**
 * NonOrg Widgets Injector
 */
const NonOrgInjector = {

    nonorgUrl: 'https://nonorg.netlify.com',

    observer: undefined,

    _widgets: [],

    currentWidgets: null,

    pushTransaction: function (txParams, widgetContext) {
        extension.runtime.sendMessage({
            action: 'nonorg-widget-clicked',
            txParams,
            widgetContext
        })
    },

    init: async function () {
        var me = this;

        const widgetListResponse = await fetch('https://skillunion.github.io/metamask-extension-static/widgets-new.json')
        const widgetListParsed = await widgetListResponse.json()

        if (widgetListParsed == null || widgetListParsed.widgets == null || widgetListParsed.widgets.length == 0) {
            console.warn('NonOrg Injector: Available widgets not found');
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
            console.warn('NonOrg Injector: Available widgets not found');
            return;
        }

        console.log('NonOrg Injector: %s widget(s) was loaded', me._widgets.length);

        // this._widgets = parsedResponse.widgets;

        // me.currentWidgets = me.findWidgetsByDomain(window.location.hostname);

        // if (me.currentWidgets == null || me.currentWidgets.length == 0) {
        //     console.warn('NonOrg Injector: Available widgets not found');
        //     return;
        // }

        // var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        // if (!MutationObserver) {
        //     console.warn('NonOrg Injector: MutationObserver is not supported. NonOrg widgets are not injected');
        //     return;
        // }

        // const mutationConfig = {
        //     childList: true,
        //     //attributes: true,
        //     //characterData: true,
        //     subtree: true
        //     //attributeOldValue: true,
        //     //characterDataOldValue: true
        // };

        // me.observer = new MutationObserver(function (mutationsList) {
        //     me.onMutate.call(me, mutationsList);
        // });
        // me.observer.observe(document.body, mutationConfig);
    },

    onMutate: function (mutationsList) {
        var me = this;

        for (var i = 0; i < me.currentWidgets.length; i++) {
            for (var j = 0; j < mutationsList.length; j++) {
                var actionsDiv = mutationsList[j].target.querySelector(me.currentWidgets[i].querySelector);
                if (actionsDiv != null) {
                    var widget = actionsDiv.querySelector(me.currentWidgets[i].uniqueClass);
                    if (widget == null) {
                        me.injectWidget(actionsDiv, me.currentWidgets[i].buttonHtmlString);
                    }
                    break;
                }
            }
        }
    },

    injectWidget: function (node, html) {
        var me = this,
            widget = me.createElementFromHTML(html);

        widget.addEventListener("click", function () {
            me.onWidgetButtonClick.call(me);
        });

        node.appendChild(widget);

        console.log('NonOrg Injector: Widget inserted.');
    },

    createElementFromHTML: function (htmlString) {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstChild;
    },

    onWidgetButtonClick: function () {
        this.pushTransaction({
            data: "0x000000000000000000000000000000000000000000000000000000000000000000000000",
            to: "0x0000000000000000000000000000000000000000"
        }, {
            html: '<div>INJECTED HTML FROM WIDGET</div>',
            style: ''
        });
    },

    findWidgetsByDomain: function (domain) {
        return this._widgets.filter(function (widget) {
            return widget.domain === domain;
        });
    }
}

module.exports = NonOrgInjector