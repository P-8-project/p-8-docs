if (!Array.prototype.includes) {
    Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
        'use strict';
        var O = Object(this);
        var len = parseInt(O.length) || 0;
        if (len === 0) {
            return false;
        }
        var n = parseInt(arguments[1]) || 0;
        var k;
        if (n >= 0) {
            k = n;
        } else {
            k = len + n;
            if (k < 0) {k = 0;}
        }
        var currentElement;
        while (k < len) {
            currentElement = O[k];
            if (searchElement === currentElement ||
                (searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
                return true;
            }
            k++;
        }
        return false;
    };
}

(function($) {

    var typeLabelMapping = {
        "python": "Python",
        "ruby": "Ruby",
        "php": "PHP",
        "nodejs": "Node.js",
        "django": "Django"
    };

    var sheet = (function() {
        // Create the <style> tag
        var style = document.createElement("style");

        // Add a media (and/or media query) here if you'd like!
        // style.setAttribute("media", "screen")
        // style.setAttribute("media", "only screen and (max-width : 1024px)")

        // WebKit hack :(
        style.appendChild(document.createTextNode(""));

        // Add the <style> element to the page
        document.head.appendChild(style);

        return style.sheet;
    })();

    var addCSSRule = function(sheet, selector, rules, index) {
        if("insertRule" in sheet) {
            sheet.insertRule(selector + "{" + rules + "}", index);
        }
        else if("addRule" in sheet) {
            sheet.addRule(selector, rules, index);
        }
    };

    var tabsSource = '<div class="tabs-area">{{#each languages}}<div class="tab tab-{{id}}" data-language-id="{{id}}">{{label}}</div>{{/each}}</div>';
    var tabsTemplate = Handlebars.compile(tabsSource);

    var emptySource = '<div class="tab-type-{{id}} highlight-tab"><pre class="highlight">' +
        '<code>No example code is available for {{label}}. Please select another language to view an example.</code>' +
        '</pre></div>';
    var emptyTemplate = Handlebars.compile(emptySource);

    var tabDefs = [];

    var buildTabbedExampleSelectClass = function(id) {
        return "tabbed-example-select-" + id;
    };

    var setTab = function(id) {
        var body = $("body");
        $.each(tabDefs, function() {
            body.removeClass(buildTabbedExampleSelectClass(this.id));
        });
        body.addClass(buildTabbedExampleSelectClass(id));
    };

    var makeSafeForCSS = function(name) {
        return name.replace(/[^a-z0-9]/g, function(s) {
            var c = s.charCodeAt(0);
            if (c == 32) return '-';
            if (c >= 65 && c <= 90) return '_' + s.toLowerCase();
            return '__' + ('000' + c.toString(16)).slice(-4);
        });
    };

    $(function() {

        var tabKeys = {};

        $(".tabbed-example")
            .each(function() {
                $(this).find("> div")
                    .each(function () {
                        var $this = $(this);

                        var tabType = $this.data("tabType");
                        var id = makeSafeForCSS(tabType);
                        $this.addClass("tab-type-" + id);

                        if (!(tabType in tabKeys)) {
                            var label = id in typeLabelMapping ? typeLabelMapping[id] : tabType;
                            tabDefs.push({id: id, label: label});
                            tabKeys[tabType] = true;
                        }
                    });
            })

        .each(function(i) {
            var container = $(this);

            var name = "tabset-" + i;
            container.data("tabdef", name);

            if (tabDefs.length > 1) {
                container.addClass("clickable");
            }

            var selectedTabContentSelectors = [];
            var selectedTabSelectors = [];

            $.each(tabDefs, function() {
                var language = this;
                var items = container.find(".tab-type-" + language.id);
                // Remove all but first
                items.not(":first").remove();
                if (items.length == 0) {
                    $(emptyTemplate(language)).appendTo(container);
                }
                items.addClass("highlight-tab");

                selectedTabContentSelectors.push("body." + buildTabbedExampleSelectClass(language.id) + " .tabbed-example .tabs-area .tab-" + language.id);
                selectedTabSelectors.push("body." + buildTabbedExampleSelectClass(language.id) + " .tabbed-example .tab-type-" + language.id);
            });

            $(tabsTemplate({languages: tabDefs})).prependTo(container);

            var selectedTabContentSelectorsText = selectedTabContentSelectors.join(',');
            var selectedTabSelectorsText = selectedTabSelectors.join(',');

            addCSSRule(sheet, selectedTabContentSelectorsText, "background: #f4f4f4;font-weight: bold;border-bottom: 1px solid #f4f4f4;", 0);
            addCSSRule(sheet, selectedTabSelectorsText, "display: block;", 0);
        });

        $("body").on("click", ".tabbed-example.clickable .tab", function(e) {
            e.preventDefault();
            var offset1 = $(this).closest(".tabbed-example").offset().top;
            var languageId = $(this).data("languageId");
            setTab(languageId);
            var offset2 = $(this).closest(".tabbed-example").offset().top;
            var diff = Math.round(offset2 - offset1); // The document has scrolled by this much
            $("html, body").scrollTop($(document).scrollTop() + diff);
        });

        if (tabDefs.length > 0) {
            setTab(tabDefs[0].id);
        }
    });


})(jQuery);
