import { readBlockConfig } from '../../scripts/aem.js';

/**
 * Decorates the title block with alignment options
 * @param {Element} block The title block element
 */
export default function decorate(block) {
  // Try to read alignment from DOM elements first (like hero block does)
  let alignment = 'text-left'; // Default to left alignment
  
  // Look for alignment configuration in the block content
  const alignmentElement = block.querySelector('p[data-aue-prop="titleAlignment"] div');
  if (alignmentElement) {
    const alignmentValue = alignmentElement.textContent?.trim();
    if (alignmentValue && ['text-left', 'text-center', 'text-right'].includes(alignmentValue)) {
      alignment = alignmentValue;
    }
  }
  
  // Fallback to readBlockConfig if DOM method doesn't work
  if (alignment === 'text-left') {
    const config = readBlockConfig(block);
    console.log('Title block config:', config);
    if (config?.titleAlignment) {
      alignment = config.titleAlignment;
    }
  }
  
  console.log('Using alignment:', alignment);
  
  // Apply alignment to the block container first
  block.classList.add(alignment);
  block.classList.add('title-block');
  
  // Find the title element (h1, h2, h3, etc.) with AEM data attributes
  const titleElement = block.querySelector('h1[data-aue-model="title"], h2[data-aue-model="title"], h3[data-aue-model="title"], h4[data-aue-model="title"], h5[data-aue-model="title"], h6[data-aue-model="title"]');
  
  if (titleElement) {
    // Apply the alignment class to the title element
    titleElement.classList.add(alignment);
    console.log('Applied alignment:', alignment, 'to title element:', titleElement);
  } else {
    console.log('No title element found yet - will apply when content is added');
    
    // Set up a mutation observer to watch for when title elements are added
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const titleElement = block.querySelector('h1[data-aue-model="title"], h2[data-aue-model="title"], h3[data-aue-model="title"], h4[data-aue-model="title"], h5[data-aue-model="title"], h6[data-aue-model="title"]');
          if (titleElement) {
            titleElement.classList.add(alignment);
            console.log('Applied alignment to newly added title element:', titleElement);
            observer.disconnect(); // Stop observing once we've applied the alignment
          }
        }
      });
    });
    
    // Start observing the block for changes
    observer.observe(block, { childList: true, subtree: true });
  }
  
  // Hide the alignment configuration paragraph if it exists
  const alignmentParagraph = block.querySelector('p[data-aue-prop="titleAlignment"]');
  if (alignmentParagraph) {
    alignmentParagraph.style.display = 'none';
  }
}
