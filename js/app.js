(() => {
    "use strict";
    const modules_flsModules = {};
    let _slideUp = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = `${target.offsetHeight}px`;
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout((() => {
                target.hidden = !showmore ? true : false;
                !showmore ? target.style.removeProperty("height") : null;
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                !showmore ? target.style.removeProperty("overflow") : null;
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideUpDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideDown = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.hidden = target.hidden ? false : null;
            showmore ? target.style.removeProperty("height") : null;
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout((() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideDownDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
    };
    function spollers() {
        const spollersArray = document.querySelectorAll("[data-spollers]");
        if (spollersArray.length > 0) {
            document.addEventListener("click", setSpollerAction);
            const spollersRegular = Array.from(spollersArray).filter((function(item, index, self) {
                return !item.dataset.spollers.split(",")[0];
            }));
            if (spollersRegular.length) initSpollers(spollersRegular);
            let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", (function() {
                    initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
                initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
            function initSpollers(spollersArray, matchMedia = false) {
                spollersArray.forEach((spollersBlock => {
                    spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                    if (matchMedia.matches || !matchMedia) {
                        spollersBlock.classList.add("_spoller-init");
                        initSpollerBody(spollersBlock);
                    } else {
                        spollersBlock.classList.remove("_spoller-init");
                        initSpollerBody(spollersBlock, false);
                    }
                }));
            }
            function initSpollerBody(spollersBlock, hideSpollerBody = true) {
                let spollerItems = spollersBlock.querySelectorAll("details");
                if (spollerItems.length) spollerItems.forEach((spollerItem => {
                    let spollerTitle = spollerItem.querySelector("summary");
                    if (hideSpollerBody) {
                        spollerTitle.removeAttribute("tabindex");
                        if (!spollerItem.hasAttribute("data-open")) {
                            spollerItem.open = false;
                            spollerTitle.nextElementSibling.hidden = true;
                        } else {
                            spollerTitle.classList.add("_spoller-active");
                            spollerItem.open = true;
                        }
                    } else {
                        spollerTitle.setAttribute("tabindex", "-1");
                        spollerTitle.classList.remove("_spoller-active");
                        spollerItem.open = true;
                        spollerTitle.nextElementSibling.hidden = false;
                    }
                }));
            }
            function setSpollerAction(e) {
                const el = e.target;
                if (el.closest("summary") && el.closest("[data-spollers]")) {
                    e.preventDefault();
                    if (el.closest("[data-spollers]").classList.contains("_spoller-init")) {
                        const spollerTitle = el.closest("summary");
                        const spollerBlock = spollerTitle.closest("details");
                        const spollersBlock = spollerTitle.closest("[data-spollers]");
                        const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
                        const scrollSpoller = spollerBlock.hasAttribute("data-spoller-scroll");
                        const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                        if (!spollersBlock.querySelectorAll("._slide").length) {
                            if (oneSpoller && !spollerBlock.open) hideSpollersBody(spollersBlock);
                            !spollerBlock.open ? spollerBlock.open = true : setTimeout((() => {
                                spollerBlock.open = false;
                            }), spollerSpeed);
                            spollerTitle.classList.toggle("_spoller-active");
                            _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
                            if (scrollSpoller && spollerTitle.classList.contains("_spoller-active")) {
                                const scrollSpollerValue = spollerBlock.dataset.spollerScroll;
                                const scrollSpollerOffset = +scrollSpollerValue ? +scrollSpollerValue : 0;
                                const scrollSpollerNoHeader = spollerBlock.hasAttribute("data-spoller-scroll-noheader") ? document.querySelector(".header").offsetHeight : 0;
                                window.scrollTo({
                                    top: spollerBlock.offsetTop - (scrollSpollerOffset + scrollSpollerNoHeader),
                                    behavior: "smooth"
                                });
                            }
                        }
                    }
                }
                if (!el.closest("[data-spollers]")) {
                    const spollersClose = document.querySelectorAll("[data-spoller-close]");
                    if (spollersClose.length) spollersClose.forEach((spollerClose => {
                        const spollersBlock = spollerClose.closest("[data-spollers]");
                        const spollerCloseBlock = spollerClose.parentNode;
                        if (spollersBlock.classList.contains("_spoller-init")) {
                            const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                            spollerClose.classList.remove("_spoller-active");
                            _slideUp(spollerClose.nextElementSibling, spollerSpeed);
                            setTimeout((() => {
                                spollerCloseBlock.open = false;
                            }), spollerSpeed);
                        }
                    }));
                }
            }
            function hideSpollersBody(spollersBlock) {
                const spollerActiveBlock = spollersBlock.querySelector("details[open]");
                if (spollerActiveBlock && !spollersBlock.querySelectorAll("._slide").length) {
                    const spollerActiveTitle = spollerActiveBlock.querySelector("summary");
                    const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                    spollerActiveTitle.classList.remove("_spoller-active");
                    _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
                    setTimeout((() => {
                        spollerActiveBlock.open = false;
                    }), spollerSpeed);
                }
            }
        }
    }
    function getDigFormat(item, sepp = " ") {
        return item.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, `$1${sepp}`);
    }
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    function dataMediaQueries(array, dataSetValue) {
        const media = Array.from(array).filter((function(item, index, self) {
            if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
        }));
        if (media.length) {
            const breakpointsArray = [];
            media.forEach((item => {
                const params = item.dataset[dataSetValue];
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            }));
            let mdQueries = breakpointsArray.map((function(item) {
                return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
            }));
            mdQueries = uniqArray(mdQueries);
            const mdQueriesArray = [];
            if (mdQueries.length) {
                mdQueries.forEach((breakpoint => {
                    const paramsArray = breakpoint.split(",");
                    const mediaBreakpoint = paramsArray[1];
                    const mediaType = paramsArray[2];
                    const matchMedia = window.matchMedia(paramsArray[0]);
                    const itemsArray = breakpointsArray.filter((function(item) {
                        if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                    }));
                    mdQueriesArray.push({
                        itemsArray,
                        matchMedia
                    });
                }));
                return mdQueriesArray;
            }
        }
    }
    class ScrollWatcher {
        constructor(props) {
            let defaultConfig = {};
            this.config = Object.assign(defaultConfig, props);
            this.observer;
            !document.documentElement.classList.contains("watcher") ? this.scrollWatcherRun() : null;
        }
        scrollWatcherUpdate() {
            this.scrollWatcherRun();
        }
        scrollWatcherRun() {
            document.documentElement.classList.add("watcher");
            this.scrollWatcherConstructor(document.querySelectorAll("[data-watch]"));
        }
        scrollWatcherConstructor(items) {
            if (items.length) {
                let uniqParams = uniqArray(Array.from(items).map((function(item) {
                    if (item.dataset.watch === "navigator" && !item.dataset.watchThreshold) {
                        let valueOfThreshold;
                        if (item.clientHeight > 2) {
                            valueOfThreshold = window.innerHeight / 2 / (item.clientHeight - 1);
                            if (valueOfThreshold > 1) valueOfThreshold = 1;
                        } else valueOfThreshold = 1;
                        item.setAttribute("data-watch-threshold", valueOfThreshold.toFixed(2));
                    }
                    return `${item.dataset.watchRoot ? item.dataset.watchRoot : null}|${item.dataset.watchMargin ? item.dataset.watchMargin : "0px"}|${item.dataset.watchThreshold ? item.dataset.watchThreshold : 0}`;
                })));
                uniqParams.forEach((uniqParam => {
                    let uniqParamArray = uniqParam.split("|");
                    let paramsWatch = {
                        root: uniqParamArray[0],
                        margin: uniqParamArray[1],
                        threshold: uniqParamArray[2]
                    };
                    let groupItems = Array.from(items).filter((function(item) {
                        let watchRoot = item.dataset.watchRoot ? item.dataset.watchRoot : null;
                        let watchMargin = item.dataset.watchMargin ? item.dataset.watchMargin : "0px";
                        let watchThreshold = item.dataset.watchThreshold ? item.dataset.watchThreshold : 0;
                        if (String(watchRoot) === paramsWatch.root && String(watchMargin) === paramsWatch.margin && String(watchThreshold) === paramsWatch.threshold) return item;
                    }));
                    let configWatcher = this.getScrollWatcherConfig(paramsWatch);
                    this.scrollWatcherInit(groupItems, configWatcher);
                }));
            }
        }
        getScrollWatcherConfig(paramsWatch) {
            let configWatcher = {};
            if (document.querySelector(paramsWatch.root)) configWatcher.root = document.querySelector(paramsWatch.root);
            configWatcher.rootMargin = paramsWatch.margin;
            if (paramsWatch.margin.indexOf("px") < 0 && paramsWatch.margin.indexOf("%") < 0) return;
            if (paramsWatch.threshold === "prx") {
                paramsWatch.threshold = [];
                for (let i = 0; i <= 1; i += .005) paramsWatch.threshold.push(i);
            } else paramsWatch.threshold = paramsWatch.threshold.split(",");
            configWatcher.threshold = paramsWatch.threshold;
            return configWatcher;
        }
        scrollWatcherCreate(configWatcher) {
            console.log(configWatcher);
            this.observer = new IntersectionObserver(((entries, observer) => {
                entries.forEach((entry => {
                    this.scrollWatcherCallback(entry, observer);
                }));
            }), configWatcher);
        }
        scrollWatcherInit(items, configWatcher) {
            this.scrollWatcherCreate(configWatcher);
            items.forEach((item => this.observer.observe(item)));
        }
        scrollWatcherIntersecting(entry, targetElement) {
            if (entry.isIntersecting) !targetElement.classList.contains("_watcher-view") ? targetElement.classList.add("_watcher-view") : null; else targetElement.classList.contains("_watcher-view") ? targetElement.classList.remove("_watcher-view") : null;
        }
        scrollWatcherOff(targetElement, observer) {
            observer.unobserve(targetElement);
        }
        scrollWatcherCallback(entry, observer) {
            const targetElement = entry.target;
            this.scrollWatcherIntersecting(entry, targetElement);
            targetElement.hasAttribute("data-watch-once") && entry.isIntersecting ? this.scrollWatcherOff(targetElement, observer) : null;
            document.dispatchEvent(new CustomEvent("watcherCallback", {
                detail: {
                    entry
                }
            }));
        }
    }
    modules_flsModules.watcher = new ScrollWatcher({});
    let addWindowScrollEvent = false;
    function digitsCounter() {
        function digitsCountersInit(digitsCountersItems) {
            let digitsCounters = digitsCountersItems ? digitsCountersItems : document.querySelectorAll("[data-digits-counter]");
            if (digitsCounters.length) digitsCounters.forEach((digitsCounter => {
                if (digitsCounter.hasAttribute("data-go")) return;
                digitsCounter.setAttribute("data-go", "");
                digitsCounter.dataset.digitsCounter = digitsCounter.innerHTML;
                digitsCounter.innerHTML = `0`;
                digitsCountersAnimate(digitsCounter);
            }));
        }
        function digitsCountersAnimate(digitsCounter) {
            let startTimestamp = null;
            const duration = parseFloat(digitsCounter.dataset.digitsCounterSpeed) ? parseFloat(digitsCounter.dataset.digitsCounterSpeed) : 1e3;
            const startValue = parseFloat(digitsCounter.dataset.digitsCounter);
            const format = digitsCounter.dataset.digitsCounterFormat ? digitsCounter.dataset.digitsCounterFormat : " ";
            const startPosition = 0;
            const step = timestamp => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const value = Math.floor(progress * (startPosition + startValue));
                digitsCounter.innerHTML = typeof digitsCounter.dataset.digitsCounterFormat !== "undefined" ? getDigFormat(value, format) : value;
                if (progress < 1) window.requestAnimationFrame(step); else digitsCounter.removeAttribute("data-go");
            };
            window.requestAnimationFrame(step);
        }
        function digitsCounterAction(e) {
            const entry = e.detail.entry;
            const targetElement = entry.target;
            if (targetElement.querySelectorAll("[data-digits-counter]").length) digitsCountersInit(targetElement.querySelectorAll("[data-digits-counter]"));
        }
        document.addEventListener("watcherCallback", digitsCounterAction);
    }
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    window.addEventListener("load", (() => {
        const track = document.querySelector(".possible__marquee-block");
        const items = Array.from(track.children);
        const screenWidth = window.innerWidth;
        let trackWidth = track.scrollWidth;
        let cloneLimit = 20;
        let cloneCount = 0;
        while (trackWidth < screenWidth * 2 && cloneCount < cloneLimit) {
            items.forEach((item => {
                const clone = item.cloneNode(true);
                track.appendChild(clone);
            }));
            cloneCount++;
            trackWidth = track.scrollWidth;
        }
    }));
    spollers();
    digitsCounter();
})();