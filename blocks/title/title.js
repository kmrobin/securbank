import { readBlockConfig } from '../../scripts/aem.js';

/**
 * Decorates the title block with alignment options
 * @param {Element} block The title block element
 */
export default function decorate(block) {
  // Read the alignment configuration from the block
  const config = readBlockConfig(block);
  const alignment = config.titleAlignment || 'text-left'; // Default to left alignment
  
  // Find the title element (h1, h2, h3, etc.)
  const titleElement = block.querySelector('h1, h2, h3, h4, h5, h6');
  
  if (titleElement) {
    // Apply the alignment class to the title element
    titleElement.classList.add(alignment);
  }
  
  // Also apply alignment to the block container for broader styling control
  block.classList.add(alignment);
}
