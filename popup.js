document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration Constants ---
    const SitePrefix = "+site%3A";
    const SiteRedditPosts = "https://www.reddit.com/r/*/comments/";
    const SiteYoutube = "youtube.com";
    const SiteYoutubeShorts = "youtube.com/shorts/";
    const SiteInstagramReel = "https://www.instagram.com/reel/";
    const SiteGithub = "https://github.com/*/*";
    const SiteLinkedInProfile = "https://www.linkedin.com/in/*/";
    const YoutubeBaseURL = "https://www.youtube.com/results?search_query=";
    const ViewsParam = "&sp=CAM%253D";
    const VideoSearchParam = "&tbm=vid";
    const GoogleBaseURL = "https://www.google.com/search?q=";
    const GoogleImageParam = "&udm=2";
    const DAY_IN_MILLIS = 24 * 60 * 60 * 1000;
    const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // --- Default Date Configuration ---
    const DEFAULT_START_DATE_STR = "2015-01-01";
    const DEFAULT_END_DATE_STR = formatYYYYMMDD(getTodayUTC());
    const DEFAULT_DAYS_GAP = 30;

    // --- Define Search Type Groups ---
    const GOOGLE_SEARCHES = ['google-youtube', 'google-normal', 'google-images', 'reddit', 'youtube-shorts', 'instagram', 'github', 'reddit-video', 'linkedin', 'google-news'];
    const YOUTUBE_DIRECT = ['youtube-relevance', 'youtube-views'];
    const IMAGE_SEARCHES_SITE = ['google-images-youtube', 'google-images-reddit', 'google-images-instagram', 'google-images-github', 'google-images-shorts'];
    const YOUTUBE_RELATED_TYPES = ['google-youtube', 'youtube-shorts', 'youtube-relevance', 'youtube-views', 'google-images-youtube', 'google-images-shorts'];
    const REDDIT_RELATED_TYPES = ['reddit', 'reddit-video', 'google-images-reddit'];
    const IMAGE_RELATED_TYPES = ['google-images', ...IMAGE_SEARCHES_SITE];
    const ALL_SEARCH_TYPES = [...GOOGLE_SEARCHES, ...YOUTUBE_DIRECT, ...IMAGE_SEARCHES_SITE];

    // --- DOM Elements ---
    const keywordInput = document.getElementById('keyword');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const daysGapInput = document.getElementById('days-gap');
    const resetDatesButton = document.getElementById('reset-dates');
    const displayDateRangeEl = document.getElementById('display-date-range');
    const regenerateButton = document.getElementById('regenerate-dates');
    const errorMessageEl = document.getElementById('error-message');
    const searchButtons = document.querySelectorAll('.button-grid button');
    const pastDaySelect = document.getElementById('select-past-day');
    const selectPresetYear = document.getElementById('select-preset-year');
    const openAllButton = document.getElementById('btn-open-all');
    const openYoutubeButton = document.getElementById('btn-open-youtube');
    const openRedditButton = document.getElementById('btn-open-reddit');
    const openImagesButton = document.getElementById('btn-open-images');

    const presetButtons = {
        '3d': document.getElementById('btn-preset-3d'),
        '7d': document.getElementById('btn-preset-7d'),
        '14d': document.getElementById('btn-preset-14d'),
        '30d': document.getElementById('btn-preset-30d'),
        '1w-ago': document.getElementById('btn-preset-1w-ago'),
    };

    // --- State ---
    let currentFirstDate = null;
    let currentSecondDate = null;

    // --- Helper Functions ---
    function formatYYYYMMDD(date) {
        if (!(date instanceof Date) || isNaN(date)) return '';
        return date.toISOString().split('T')[0];
    }

    function formatDisplayDate(date) {
        if (!(date instanceof Date) || isNaN(date)) return '-- --- ----';
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = MONTHS_SHORT[date.getUTCMonth()];
        const year = date.getUTCFullYear();
        return `${day} ${month} ${year}`;
    }

    function formatDropdownDate(date, index) {
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = MONTHS_SHORT[date.getUTCMonth()];
        let suffix = "";
        if (index === 0) suffix = " (Today)";
        else if (index === 1) suffix = " (Yesterday)";
        return `${month} ${day}${suffix}`;
    }

    function parseDateString(dateString) {
        if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return null;
        const date = new Date(`${dateString}T00:00:00Z`);
        return isNaN(date.getTime()) ? null : date;
    }

    function getTodayUTC() {
        const today = new Date();
        return new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
    }

    function getDateBefore(baseDate, daysAgo) {
        return new Date(baseDate.getTime() - daysAgo * DAY_IN_MILLIS);
    }

    function setActiveDateRange(firstDate, secondDate) {
        clearError();
        if (firstDate && secondDate && !isNaN(firstDate) && !isNaN(secondDate)) {
            if (firstDate.getTime() > secondDate.getTime()) {
                [firstDate, secondDate] = [secondDate, firstDate];
            }
            currentFirstDate = firstDate;
            currentSecondDate = secondDate;

            if (currentFirstDate.getTime() === currentSecondDate.getTime()) {
                displayDateRangeEl.textContent = formatDisplayDate(currentFirstDate);
            } else {
                displayDateRangeEl.textContent = `${formatDisplayDate(currentFirstDate)} to ${formatDisplayDate(currentSecondDate)}`;
            }

        } else {
            showError("Invalid date range selected.");
            currentFirstDate = null;
            currentSecondDate = null;
            displayDateRangeEl.textContent = '-- --- ---- to -- --- ----';
        }
    }

    function generateAndSetRandomDateRange() {
        clearError();
        const startDate = parseDateString(startDateInput.value);
        const endDate = parseDateString(endDateInput.value) || getTodayUTC();
        const gap = parseInt(daysGapInput.value, 10);

        if (!startDate) { showError("Invalid manual Start date."); return; }
        if (isNaN(gap) || gap < 0) { showError("Invalid Days Gap. Must be 0 or more."); return; }
        if (startDate.getTime() > endDate.getTime()) { showError("Start date cannot be after End date."); return; }

        const startMillis = startDate.getTime();
        const endMillis = endDate.getTime();
        const gapMillis = gap * DAY_IN_MILLIS;
        const maxFirstDateMillis = endMillis - gapMillis;

        if (maxFirstDateMillis < startMillis) {
            showError("Gap is larger than date range. Using full range.");
            setActiveDateRange(startDate, endDate);
            return;
        }

        const randomFirstMillis = startMillis + Math.random() * (maxFirstDateMillis - startMillis);
        const firstDate = new Date(randomFirstMillis);
        const firstDateMidnight = new Date(Date.UTC(firstDate.getUTCFullYear(), firstDate.getUTCMonth(), firstDate.getUTCDate()));
        const secondDate = new Date(firstDateMidnight.getTime() + gapMillis);

        setActiveDateRange(firstDateMidnight, secondDate);
    }

    function openUrlInNewTab(url) {
        if (url) {
            chrome.tabs.create({ url, active: true });
        }
    }

    function showError(message) { errorMessageEl.textContent = message; }
    function clearError() { errorMessageEl.textContent = ''; }

    function getEncodedKeyword() {
        const keyword = keywordInput.value.trim();
        if (!keyword) { showError("Please enter a keyword."); keywordInput.focus(); return null; }
        clearError();
        return encodeURIComponent(keyword);
    }

    function getDateConstraint() {
        if (!currentFirstDate || !currentSecondDate) {
            showError("Invalid active date range.");
            return null;
        }
        const dateBeforeFirst = new Date(currentFirstDate.getTime() - DAY_IN_MILLIS);
        const dateAfterSecond = new Date(currentSecondDate.getTime() + DAY_IN_MILLIS);

        const afterDateStr = formatYYYYMMDD(dateBeforeFirst);
        const beforeDateStr = formatYYYYMMDD(dateAfterSecond);

        if (!afterDateStr || !beforeDateStr) {
            showError("Date formatting failed.");
            return null;
        }
        return `+before%3A${beforeDateStr}+after%3A${afterDateStr}`;
    }

    function generateUrl(type, preKeyword = null, preDateConstraint = null) {
        const keyword = preKeyword ?? getEncodedKeyword();
        if (!keyword) return null;
        const dateConstraint = preDateConstraint ?? getDateConstraint();
        if (!dateConstraint) return null;

        const youtubeDateConstraint = dateConstraint.replace(/\+/g, '%20');
        const base = GoogleBaseURL + keyword;
        const site = (s) => `${SitePrefix}${s}`;

        switch (type) {
            case 'google-youtube': return `${base}${site(SiteYoutube)}${dateConstraint}`;
            case 'google-normal': return `${base}${dateConstraint}`;
            case 'google-images': return `${base}${dateConstraint}${GoogleImageParam}`;
            case 'reddit': return `${base}${site(SiteRedditPosts)}${dateConstraint}`;
            case 'youtube-shorts': return `${base}${site(SiteYoutubeShorts)}${dateConstraint}`;
            case 'instagram': return `${base}${site(SiteInstagramReel)}${dateConstraint}`;
            case 'github': return `${base}${site(SiteGithub)}${dateConstraint}`;
            case 'linkedin': return `${base}${site(SiteLinkedInProfile)}${dateConstraint}`;
            case 'reddit-video': return `${base}${site(SiteRedditPosts)}${dateConstraint}${VideoSearchParam}`;
            case 'google-news': return `${base}${dateConstraint}&tbm=nws&source`;
            case 'youtube-relevance': return `${YoutubeBaseURL}${keyword}${youtubeDateConstraint}`;
            case 'youtube-views': return `${YoutubeBaseURL}${keyword}${youtubeDateConstraint}${ViewsParam}`;
            case 'google-images-youtube': return `${base}${site(SiteYoutube)}${dateConstraint}${GoogleImageParam}`;
            case 'google-images-reddit': return `${base}${site(SiteRedditPosts)}${dateConstraint}${GoogleImageParam}`;
            case 'google-images-instagram': return `${base}${site(SiteInstagramReel)}${dateConstraint}${GoogleImageParam}`;
            case 'google-images-github': return `${base}${site(SiteGithub)}${dateConstraint}${GoogleImageParam}`;
            case 'google-images-shorts': return `${base}${site(SiteYoutubeShorts)}${dateConstraint}${GoogleImageParam}`;
            default: console.error("Unknown button type:", type); return null;
        }
    }

    function saveManualSettings() {
        const settings = {
            keyword: keywordInput.value,
            startDate: startDateInput.value,
            endDate: endDateInput.value,
            daysGap: daysGapInput.value
        };
        chrome.storage.local.set({ manualSettings: settings });
    }

    function loadManualSettings() {
        chrome.storage.local.get('manualSettings', (result) => {
            const settings = result.manualSettings || {};
            keywordInput.value = settings.keyword || '';
            startDateInput.value = settings.startDate || DEFAULT_START_DATE_STR;
            endDateInput.value = settings.endDate || DEFAULT_END_DATE_STR;
            daysGapInput.value = settings.daysGap !== undefined ? settings.daysGap : DEFAULT_DAYS_GAP;
            generateAndSetRandomDateRange();
        });
    }

    function populatePastDaysDropdown() {
        const today = getTodayUTC();
        while (pastDaySelect.options.length > 1) {
            pastDaySelect.remove(1);
        }
        for (let i = 0; i < 30; i++) {
            const targetDate = getDateBefore(today, i);
            const option = document.createElement('option');
            option.value = formatYYYYMMDD(targetDate);
            option.textContent = formatDropdownDate(targetDate, i);
            pastDaySelect.appendChild(option);
        }
    }

    function populateYearDropdown() {
        const startYear = 2000;
        const currentYear = getTodayUTC().getUTCFullYear();

        for (let year = currentYear; year >= startYear; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            selectPresetYear.appendChild(option);
        }
    }
    
    // *** NEW LOGIC HERE ***
    function getContextualBaseDate() {
        const selectedYear = selectPresetYear.value;
        if (selectedYear) {
            const today = getTodayUTC();
            const year = parseInt(selectedYear, 10);
            
            // Create the target date using today's month/day but the selected year.
            let baseDate = new Date(Date.UTC(year, today.getUTCMonth(), today.getUTCDate()));

            // This handles the leap year case. If today is Feb 29 and the selected
            // year is not a leap year, JS would create March 1. This check corrects it.
            if (baseDate.getUTCMonth() !== today.getUTCMonth()) {
                // The date rolled over, so set to the last day of the correct month.
                baseDate = new Date(Date.UTC(year, today.getUTCMonth() + 1, 0));
            }
            return baseDate;
        } else {
            // If no year is selected, the context is simply today.
            return getTodayUTC();
        }
    }
    
    // *** UPDATED with new logic ***
    function handlePresetRangeClick(days) {
        clearError();
        const endDate = getContextualBaseDate();
        const startDate = getDateBefore(endDate, days - 1);
        
        startDateInput.value = formatYYYYMMDD(startDate);
        endDateInput.value = formatYYYYMMDD(endDate);
        daysGapInput.value = days - 1;
        setActiveDateRange(startDate, endDate);
        saveManualSettings();
        pastDaySelect.value = ""; // Reset day selector
    }

    // *** UPDATED with new logic ***
    function handleOneWeekAgoClick() {
        clearError();
        const baseDate = getContextualBaseDate();
        const endDate = getDateBefore(baseDate, 7);
        const startDate = getDateBefore(endDate, 6); // A 7-day period starting 1 week ago

        startDateInput.value = formatYYYYMMDD(startDate);
        endDateInput.value = formatYYYYMMDD(endDate);
        daysGapInput.value = 6;
        setActiveDateRange(startDate, endDate);
        saveManualSettings();
        pastDaySelect.value = ""; // Reset day selector
    }

    function handlePastDaySelectChange() {
        const selectedDateStr = pastDaySelect.value;
        if (!selectedDateStr) return;
        clearError();
        const selectedDate = parseDateString(selectedDateStr);
        if (selectedDate) {
            startDateInput.value = selectedDateStr;
            endDateInput.value = selectedDateStr;
            daysGapInput.value = 0;
            setActiveDateRange(selectedDate, selectedDate);
            saveManualSettings();
            selectPresetYear.value = ""; // Reset year selector
        }
    }

    function handleYearSelectChange() {
        const selectedYear = selectPresetYear.value;
        if (!selectedYear) {
            // If user un-selects the year, reset to default behavior
            resetDatesButton.click();
            return;
        }

        clearError();
        const year = parseInt(selectedYear, 10);
        const startDate = new Date(Date.UTC(year, 0, 1)); // Jan 1st
        const endDate = new Date(Date.UTC(year, 11, 31)); // Dec 31st

        startDateInput.value = formatYYYYMMDD(startDate);
        endDateInput.value = formatYYYYMMDD(endDate);
        daysGapInput.value = DEFAULT_DAYS_GAP;
        setActiveDateRange(startDate, endDate);
        generateAndSetRandomDateRange(); // Generate a random range within the selected year
        saveManualSettings();
        pastDaySelect.value = ""; // Reset day selector
    }

    async function openUrlGroupInNewWindow(searchTypes) {
        clearError();
        const keyword = getEncodedKeyword();
        if (!keyword) return;
        const dateConstraint = getDateConstraint();
        if (!dateConstraint) return;

        const urlsToOpen = searchTypes.map(type => generateUrl(type, keyword, dateConstraint)).filter(Boolean);

        if (urlsToOpen.length === 0) { showError("No valid URLs to open."); return; }

        try {
            const newWindow = await chrome.windows.create({ url: urlsToOpen[0], focused: true });
            if (newWindow && newWindow.id && urlsToOpen.length > 1) {
                for (let i = 1; i < urlsToOpen.length; i++) {
                    await chrome.tabs.create({ windowId: newWindow.id, url: urlsToOpen[i], active: false });
                }
            }
        } catch (error) {
            console.error("Error opening tabs:", error);
            showError("Could not open tabs.");
        }
    }

    function handleManualInputChange() {
        saveManualSettings();
        generateAndSetRandomDateRange();
        pastDaySelect.value = "";
        selectPresetYear.value = "";
    }

    // --- Event Listeners ---
    keywordInput.addEventListener('input', saveManualSettings);
    startDateInput.addEventListener('change', handleManualInputChange);
    endDateInput.addEventListener('change', handleManualInputChange);
    daysGapInput.addEventListener('change', handleManualInputChange);

    regenerateButton.addEventListener('click', generateAndSetRandomDateRange);

    resetDatesButton.addEventListener('click', () => {
        clearError();
        startDateInput.value = DEFAULT_START_DATE_STR;
        endDateInput.value = DEFAULT_END_DATE_STR;
        daysGapInput.value = DEFAULT_DAYS_GAP;
        saveManualSettings();
        generateAndSetRandomDateRange();
        pastDaySelect.value = "";
        selectPresetYear.value = "";
    });

    presetButtons['3d'].addEventListener('click', () => handlePresetRangeClick(3));
    presetButtons['7d'].addEventListener('click', () => handlePresetRangeClick(7));
    presetButtons['14d'].addEventListener('click', () => handlePresetRangeClick(14));
    presetButtons['30d'].addEventListener('click', () => handlePresetRangeClick(30));
    presetButtons['1w-ago'].addEventListener('click', handleOneWeekAgoClick);

    pastDaySelect.addEventListener('change', handlePastDaySelectChange);
    selectPresetYear.addEventListener('change', handleYearSelectChange);

    searchButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            clearError();
            const type = e.currentTarget.id.replace('btn-', '');
            const url = generateUrl(type);
            openUrlInNewTab(url);
        });
    });

    openAllButton.addEventListener('click', () => openUrlGroupInNewWindow(ALL_SEARCH_TYPES));
    openYoutubeButton.addEventListener('click', () => openUrlGroupInNewWindow(YOUTUBE_RELATED_TYPES));
    openRedditButton.addEventListener('click', () => openUrlGroupInNewWindow(REDDIT_RELATED_TYPES));
    openImagesButton.addEventListener('click', () => openUrlGroupInNewWindow(IMAGE_RELATED_TYPES));

    // --- Initialisation ---
    function initializePopup() {
        populatePastDaysDropdown();
        populateYearDropdown();
        loadManualSettings();
        keywordInput.focus();
    }

    initializePopup();
});