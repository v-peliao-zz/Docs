// windows.insight.versioncode = v20160127v3
window.insight = window.insight || {};

window.insight.debugConsoleLogEnabled = false;
window.insight.debugLogMsgs = [];
window.insight.debugLog = function(inMsg) {
    window.insight.debugLogMsgs.push(inMsg);
    if (window.insight.debugConsoleLogEnabled) {
        console.log(inMsg);
    }
};
//Common function to fire custom event on clicked element
window.insight.processWEDCSCustomEventFromArray = function(inArray) {
    if ( typeof window.MscomCustomEvent != "function") {
        return;
    } else if (!inArray || inArray.length === 0) {
        window.MscomCustomEvent();
        return;
    }
    window.MscomCustomEvent.apply(this, inArray);
};
window.insight.firePageFocusEvent = function(type) {
    window.insight.debugLog("stepped inside firePageFocusEvent function");
    var tArray = [];
    tArray.push("ms.focuseventtime", new Date().getTime());
    tArray.push("ms.focusorblue", type);
    window.insight.processWEDCSCustomEventFromArray(tArray);
};
window.insight.setupPageFocusTracking = function() {
    
    $(window).on("blur focus", function(e) {
        var prevType = $(this).data("prevType");

        if (prevType != e.type) {   //reduce double fire issues
            switch (e.type) {
                case "blur":
                    window.insight.debugLog("Blured");
                    window.insight.firePageFocusEvent("Blured");
                    break;
                case "focus":
                    window.insight.debugLog("Focused");
                    window.insight.firePageFocusEvent("Focused");
                    break;
            }
        }
        $(this).data("prevType", e.type);
    })
    
};
////////////////////// COPY EVENT
window.insight.fireCopyEvent = function(txt, length) {
    window.insight.debugLog("stepped inside fireCopyEvent function");
    var tArray = [];
    tArray.push("ms.copyeventtime", new Date().getTime());
    tArray.push("ms.copycontent", txt);
    tArray.push("ms.copycontentlength", length);
    window.insight.processWEDCSCustomEventFromArray(tArray);
};
window.insight.setupCopyTracking = function() {
    $(window).bind("copy", function(e) {
        var txt = window.getSelection().toString();
        var length = txt.length;
        txt = txt.substring(0, 20); //truncate to limit the length of WEDCS event
        window.insight.fireCopyEvent(txt, length);
    })
}
////////////////////// SWITCHER SELECTION
window.insight.fireSwitcherEvent = function(switcher, selectedValue) {
    window.insight.debugLog("stepped inside fireSwitcherEvent function");
    var tArray = [];
    tArray.push("ms.switcheventtime", new Date().getTime());
    tArray.push("ms.switcher", switcher);
    tArray.push("ms.switchervalue", selectedValue);
    window.insight.processWEDCSCustomEventFromArray(tArray);
};
window.insight.setupSwitcherTracking = function() {
    $(".menu-theme select").change(function() {
        var selectedValue = $(".menu-theme select").val();
        window.insight.fireSwitcherEvent("theme", selectedValue);
    });
    $('.menu-platform select').change(function() {
        var selectedValue = $(".menu-platform select").val();
        window.insight.fireSwitcherEvent("platform", selectedValue);
    });
    $('.menu-lang select').change(function() {
        var selectedValue = $(".menu-lang select").val();
        window.insight.fireSwitcherEvent("lang", selectedValue);
    });
}
////////////////////// SCROLL TRACKING
//Scroll Area definition
window.insight.scrollArea = function(inName) {
    this.name = inName;
    this.scrollNA = false;
    this.scrollQuarter = false;
    this.scrollHalf = false;
    this.scrollThreeQuarter = false;
    this.scrollBot = false;
};
//Track multiple scroll areas per page
window.insight.currScrollArea = null;
window.insight.scrollAreaList = [];

window.insight.setCurrScrollArea = function(inIndex) {
    if (typeof inIndex != "number") {
        return;
    } else if (window.insight.scrollAreaList.length <= inIndex) {
        return;
    }

    window.insight.currScrollArea = window.insight.scrollAreaList[inIndex];
};

//Page dimension variables
window.insight.scrollBottomElement = null;
window.insight.scrollPageHeight = -1;
window.insight.viewportBottom = -1;
window.insight.refreshScrollPageDimVars = function() {
    var tBottom = 0;
    if (window.insight.scrollBottomElement) {
        tBottom = window.insight.scrollBottomElement.getBoundingClientRect().top + window.pageYOffset;
    }
    if (tBottom <= 0) {
        tBottom = document.body.getBoundingClientRect().height;
    }
    window.insight.scrollPageHeight = tBottom;
    window.insight.viewportBottom = window.pageYOffset + window.innerHeight;
};
window.insight.suppressMobileEvents = false;
window.insight.fireScrollEvent = function(inScrollValue) {
    window.insight.fireScrollEvent(inScrollValue, "scroll");
};
window.insight.fireScrollStopEvent = function(inScrollValue) {
    window.insight.fireScrollEvent(inScrollValue, "scroll-stop");
};
window.insight.fireScrollEvent = function(inScrollValue, eventType) {
    window.insight.debugLog("stepped inside fireScrollEvent function");
    var tArray = [];
    tArray.push("ms.pgarea", "body");
    tArray.push("ms.scnum", "scroll-" + inScrollValue);
    tArray.push("ms.interactiontype", "4");
    tArray.push("ms.scn", eventType);
    window.insight.processWEDCSCustomEventFromArray(tArray);
};
window.insight.processScroll = function(stopEvent) {
    window.clearTimeout(window.insight.scrollResizeTimer);
    if (window.insight.currScrollArea === null) {
        return;
    }
    window.insight.refreshScrollPageDimVars();
    if (window.insight.scrollPageHeight <= 0) {
        return;
    } else if (window.insight.suppressMobileEvents && window.innerWidth <= 510) {
        return;
    }

    var tCurrPercent = window.insight.viewportBottom / window.insight.scrollPageHeight;
    
    if (stopEvent === true){
        window.insight.fireScrollStopEvent(Math.round(tCurrPercent * 100) + "%");
        return;
    }
    
    if (window.innerHeight > window.insight.scrollPageHeight * 0.90) {
        //Visitor can see the whole page, fire special -na event
        if (!window.insight.currScrollArea.scrollNA) {
            window.insight.currScrollArea.scrollNA = true;
            window.insight.fireScrollEvent("na");
        }
        return;
    }

    if (tCurrPercent > 0.25 && !window.insight.currScrollArea.scrollQuarter) {
        window.insight.currScrollArea.scrollQuarter = true;
        window.insight.fireScrollEvent("25%");
    }
    if (tCurrPercent > 0.50 && !window.insight.currScrollArea.scrollHalf) {
        window.insight.currScrollArea.scrollHalf = true;
        window.insight.fireScrollEvent("50%");
    }
    if (tCurrPercent > 0.75 && !window.insight.currScrollArea.scrollThreeQuarter) {
        window.insight.currScrollArea.scrollThreeQuarter = true;
        window.insight.fireScrollEvent("75%");
    }
    if (tCurrPercent > 0.99 && !window.insight.currScrollArea.scrollBot) {
        window.insight.currScrollArea.scrollBot = true;
        window.insight.fireScrollEvent("100%");
    }
};

window.insight.scrollTimer = null;
window.insight.scrollResizeTimer = 0;
window.insight.setupScrollTracking = function() {
    window.insight.scrollBottomElement = $("#footer")[0];

    window.insight.scrollAreaList.push(new window.insight.scrollArea("body"));
    window.insight.setCurrScrollArea(0);

    window.addEventListener("scroll", function() {
        window.insight.processScroll(false);
    });
    
    //catch scroll stop event (stop more than 10 seconds)
    if(window.insight.scrollTimer !== null){
        window.clearTimeout(window.insight.scrollTimer);
    }
    window.insight.scrollTimer = window.setTimeout(function (){
        window.insight.processScroll(true);
    }, 1000 * 10);

    //Note: resize also catches zoom in/out
    $(window).resize(function() {
        window.clearTimeout(window.insight.scrollResizeTimer);
        window.insight.scrollResizeTimer = window.setTimeout(function() {
            window.insight.processScroll(false);
        }, 500);
    });
};
window.insight.enableWEDCS = function() {
    //WEDCS base settings
    window.varClickTracking = 1;
    window.varCustomerTracking = 0;
    window.varAutoFirePV = 1;
    window.route = "";
    window.ctrl = "";
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "//c.microsoft.com/ms.js";
    document.getElementsByTagName("head")[0].appendChild(script);
}
$(document).ready(function(){
    window.insight.enableWEDCS();
    window.insight.setupPageFocusTracking();
    window.insight.setupScrollTracking();
    window.insight.setupCopyTracking();
    window.insight.setupSwitcherTracking();
});
