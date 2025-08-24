import { readBlockConfig } from '../../scripts/aem.js';

/**
 * Decorates the title block with alignment options
 * @param {Element} block The title block element
 */
export default function decorate(block) {
  // Read the alignment configuration from the block
  const config = readBlockConfig(block);
  const alignment = config.titleAlignment || 'text-left'; // Default to left alignment
  
  // Find the title element (h1, h2, h3, etc.) with AEM data attributes
  const titleElement = block.querySelector('h1[data-aue-model="title"], h2[data-aue-model="title"], h3[data-aue-model="title"], h4[data-aue-model="title"], h5[data-aue-model="title"], h6[data-aue-model="title"]');
  
  if (titleElement) {
    // Apply the alignment class to the title element
    titleElement.classList.add(alignment);
    console.log('Applied alignment:', alignment, 'to title element:', titleElement);
  } else {
    console.log('No title element found in block:', block);
  }
  
  // Also apply alignment to the block container for broader styling control
  block.classList.add(alignment);
  block.classList.add('title-block');
}
