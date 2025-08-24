import { readBlockConfig } from '../../scripts/aem.js';

/**
 * Decorates the title block with alignment options
 * @param {Element} block The title block element
 */
export default function decorate(block) {
  console.log('Title block decorate called for:', block);
  
  // Add title-block class to the block
  block.classList.add('title-block');
  
  // Function to apply alignment to title elements
  function applyAlignmentToTitleElements(alignment) {
    // Find all title elements (h1, h2, h3, etc.) with AEM data attributes
    const titleElements = block.querySelectorAll('h1[data-aue-model="title"], h2[data-aue-model="title"], h3[data-aue-model="title"], h4[data-aue-model="title"], h5[data-aue-model="title"], h6[data-aue-model="title"]');
    
    titleElements.forEach(titleElement => {
      // Remove any existing alignment classes
      titleElement.classList.remove('text-left', 'text-center', 'text-right');
      // Add the new alignment class
      titleElement.classList.add(alignment);
      console.log('Applied alignment:', alignment, 'to title element:', titleElement);
    });
    
    return titleElements.length > 0;
  }
  
  // Function to read alignment from configuration
  function getAlignmentFromConfig() {
    // Method 1: Try to read from DOM elements (like hero block)
    const alignmentElement = block.querySelector('p[data-aue-prop="titleAlignment"] div');
    if (alignmentElement) {
      const alignmentValue = alignmentElement.textContent?.trim();
      console.log('Found alignment in DOM:', alignmentValue);
      if (alignmentValue && ['text-left', 'text-center', 'text-right'].includes(alignmentValue)) {
        return alignmentValue;
      }
    }
    
    // Method 2: Try readBlockConfig
    try {
      const config = readBlockConfig(block);
      console.log('Title block config from readBlockConfig:', config);
      if (config && config.titleAlignment) {
        return config.titleAlignment;
      }
    } catch (error) {
      console.log('Error reading block config:', error);
    }
    
    // Method 3: Look for alignment in any div within the block
    const allDivs = block.querySelectorAll('div');
    for (const div of allDivs) {
      const text = div.textContent?.trim();
      if (text && ['text-left', 'text-center', 'text-right'].includes(text)) {
        console.log('Found alignment in div:', text);
        return text;
      }
    }
    
    return 'text-left'; // Default
  }
  
  // Get alignment and apply it
  const alignment = getAlignmentFromConfig();
  console.log('Final alignment to apply:', alignment);
  
  // Apply alignment to existing title elements
  const hasTitleElements = applyAlignmentToTitleElements(alignment);
  
  if (!hasTitleElements) {
    console.log('No title elements found yet - setting up observer');
    
    // Set up a mutation observer to watch for when title elements are added
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const hasElements = applyAlignmentToTitleElements(alignment);
          if (hasElements) {
            console.log('Applied alignment to newly added title elements');
            observer.disconnect();
          }
        }
      });
    });
    
    // Start observing the block for changes
    observer.observe(block, { childList: true, subtree: true });
  }
  
  // Hide configuration elements
  const allElements = block.querySelectorAll('p[data-aue-prop="titleAlignment"], div');
  allElements.forEach(element => {
    const text = element.textContent?.trim();
    if (text && ['text-left', 'text-center', 'text-right'].includes(text)) {
      element.style.display = 'none';
      console.log('Hidden configuration element:', element);
    }
  });
}
