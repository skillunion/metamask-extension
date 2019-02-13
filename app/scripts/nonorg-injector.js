/**
 * NonOrg Widgets Injector
 */
const NonOrgInjector = {

    nonorgUrl: 'https://nonorg.netlify.com',

    observer: undefined,

    init: function () {
        var me = this;

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

        for (var i = 0; i < mutationsList.length; i++) {
            var actionsDiv = mutationsList[i].target.querySelector('.topic-owner .post-controls .actions');
            if (actionsDiv != null) {
                var widget = actionsDiv.querySelector('.nonorg-widget');
                if (widget == null) {
                    me.injectWidget(actionsDiv);
                }
                break;
            }
        }
    },

    injectWidget: function (node) {
        var me = this,
            widget = me.createElementFromHTML('<button class="widget-button btn-flat share no-text btn-icon nonorg-widget" style="background-color: #08c;color: #fff;">Add to NonOrg</button>');
        
        widget.addEventListener("click", function() {
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
        var workLink = window.location.href,
            workTitle = document.title,
            redirectUrl = this.nonorgUrl + '/registries/create?title=' +
                encodeURIComponent(workTitle) + '&link=' + encodeURIComponent(workLink);

        window.open(redirectUrl);
    }
}

module.exports = NonOrgInjector