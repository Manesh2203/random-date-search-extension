# MultiSearch Dashboard (Random Date Search Extension)

A powerful Chrome extension designed for researchers, journalists, content creators, and curious minds. This tool makes it easy to find web content, images, and videos from specific and often obscure date ranges across various platforms like Google, YouTube, and Reddit.

## The Problem It Solves

Have you ever tried to find something you know you saw online around a certain time, but Google's date tools are too clumsy? Or maybe you're researching an event and need to see what people were posting on YouTube or Reddit during a specific week in 2014? This extension solves that problem by giving you granular control over search date ranges and providing one-click access to multiple search platforms.

## Key Features

- **Random Date Generation:** Automatically generate a random date range within a specified start and end period.
    
- **Precise Manual Control:** Set the exact start date, end date, and day gap for your random searches.
    
- **Context-Aware Presets:**
    
    - Quickly set the search range to the "Past 3/7/14/30 Days" or "1 Week Ago".
        
    - **Unique Feature:** These presets are context-aware! If you select a specific year (e.g., 2014), clicking "Past 7 Days" will search the 7 days leading up to today's date in 2014 (e.g., June 1-7, 2014).
        
- **Specific Year & Day Selection:** Jump directly to a specific year or a specific day from the past month.
    
- **Multi-Platform Search:**
    
    - **Google:** Standard Web, Images, News, and site-specific searches.
        
    - **YouTube:** Search by relevance or view count within your date range.
        
    - **Reddit:** Find posts and videos from specific timeframes.
        
    - **Instagram, GitHub, LinkedIn:** Pinpoint content on other major platforms.
        
- **Grouped Tab Opening:** Open all related searches (e.g., all YouTube-related searches or all Image searches) in a new window with a single click, streamlining your research workflow.
    
- **Persistent Settings:** The extension remembers your last-used keyword and date settings, so you can pick up right where you left off.
    

## Installation

This extension is not on the Chrome Web Store. To install it, you need to load it as an "unpacked extension."

1. **Download:** Clone this repository or download it as a ZIP file and unzip it to a permanent location on your computer.
    
    ```
    git clone https://github.com/YourUsername/random-date-search-extension.git
    ```
    
2. **Open Chrome Extensions:** Open Google Chrome and navigate to `chrome://extensions`.
    
3. **Enable Developer Mode:** In the top-right corner of the extensions page, turn on the **Developer mode** toggle switch.
    
4. **Load the Extension:** Click the **Load unpacked** button that appears.
    
5. **Select Folder:** In the file dialog, navigate to and select the folder where you saved the extension files (the folder containing `manifest.json`).
    

The "Random Date Search" icon should now appear in your Chrome toolbar. You may need to click the puzzle piece icon and "pin" it to make it visible.

## How to Use

1. **Enter a Keyword:** Type your search term into the "Keyword" field.
    
2. **Set Your Date Boundaries:**
    
    - Use the Date Settings to define the absolute earliest start and latest end dates for your searches.
        
    - Set the **Gap (d)** to control the length of the random date ranges generated (e.g., a gap of 30 will create 30-day search windows).
        
3. **Choose a Preset (Optional):**
    
    - Use the Preset Date Ranges buttons for quick access to recent timeframes.
        
    - Select a **Specific Year** to make the presets relative to that year.
        
    - Select a **Specific Past Day** for a hyper-focused search.
        
4. **Check the Active Range:** The Active Range display shows the exact start and end dates that will be used for your search. Click the 🔄 button to generate a new random range within your boundaries.
    
5. **Click a Search Button:** Click any of the blue, red, or orange buttons to perform a search on that platform using your keyword and the active date range.
    
6. **Use Group Open Buttons:** For a comprehensive search, use the green "Open All Searches" button or other group buttons to open many tabs at once.
    

## Technical Details

- **Manifest Version:** 3
    
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
    
- **APIs:** Chrome Tabs, Storage, and Windows APIs.
    
- **Permissions:** `tabs` (to open search results), `storage` (to save your settings), and `windows` (to open groups of tabs in a new window).
    

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.
