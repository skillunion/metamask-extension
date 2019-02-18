/**
 * NonOrg Widgets Injector
 */
const NonOrgInjector = {

    nonorgUrl: 'https://nonorg.netlify.com',

    observer: undefined,

    _widgets: [
        {
            domain: 'ethresear.ch',
            querySelector: '.topic-owner .post-controls .actions',
            uniqueClass: '.nonorg-widget',
            buttonHtmlString: '<button class="widget-button btn-flat share no-text btn-icon nonorg-widget" style="background-color: #08c;color: #fff;">Add to NonOrg</button>'
        },
        {
            domain: 'ethresear.ch',
            querySelector: '.topic-owner .post-controls .actions',
            uniqueClass: '.nonorg-widget2',
            buttonHtmlString: '<button class="widget-button btn-flat share no-text btn-icon nonorg-widget2" style="background-color: #ED207B;color: #fff;">Add to NonOrg 2</button>'
        }
    ],

    currentWidgets: null,

    init: async function () {
        var me = this;

        const response = await fetch('https://skillunion.github.io/metamask-extension-static/widgets.json')
        const parsedResponse = await response.json()

        this._widgets = parsedResponse.widgets;

        me.currentWidgets = me.findWidgetsByDomain(window.location.hostname);

        if (me.currentWidgets == null || me.currentWidgets.length == 0) {
            console.warn('NonOrg Injector: Available widgets not found');
            return;
        }

        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        if (!MutationObserver) {
            console.warn('NonOrg Injector: MutationObserver is not supported. NonOrg widgets are not injected');
            return;
        }

        const mutationConfig = {
            childList: true,
            //attributes: true,
            //characterData: true,
            subtree: true
            //attributeOldValue: true,
            //characterDataOldValue: true
        };

        me.observer = new MutationObserver(function (mutationsList) {
            me.onMutate.call(me, mutationsList);
        });
        me.observer.observe(document.body, mutationConfig);
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
        // Only transactions with to = "0x0000000000000000000000000000000000000000"
        // will be catched by custom view in popup
        document.defaultView.web3.eth.sendTransaction({
            data: "0x000000000000000000000000000000000000000000000000000000000000000000000000",
            to: "0x0000000000000000000000000000000000000000"
        }, function(error, hash) {
            console.log('callback error', error);
            console.log('callback hash', hash);
        });
    },

    findWidgetsByDomain: function (domain) {
        return this._widgets.filter(function (widget) {
            return widget.domain === domain;
        });
    }
}

module.exports = NonOrgInjector