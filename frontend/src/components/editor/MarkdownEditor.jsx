import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, Italic, List, ListOrdered, Link, Image, 
  Quote, Code, Heading1, Heading2, Heading3, 
  AlignLeft, AlignCenter, AlignRight, Eye, Edit3, 
  Maximize2, Minimize2, HelpCircle, Download
} from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import useMediaQuery from '../../utils/useMediaQuery';

const MarkdownEditor = ({
  initialValue = '',
  onChange,
  placeholder = 'Write your content in Markdown...',
  minHeight = '300px',
  maxHeight = '600px',
  className = '',
  readOnly = false,
  showPreview = true,
  showToolbar = true,
  showCharCount = true,
  maxCharCount,
  onSave,
  autoSave = false,
  autoSaveInterval = 30000, // 30 seconds
}) => {
  const [content, setContent] = useState(initialValue);
  const [preview, setPreview] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const editorRef = useRef(null);
  const previewRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 640px)');
  
  // Initialize editor with content
  useEffect(() => {
    setContent(initialValue);
    updateCharCount(initialValue);
  }, [initialValue]);
  
  // Auto-save functionality
  useEffect(() => {
    let saveInterval;
    
    if (autoSave && onSave && content !== initialValue) {
      saveInterval = setInterval(() => {
        onSave(content);
      }, autoSaveInterval);
    }
    
    return () => {
      if (saveInterval) clearInterval(saveInterval);
    };
  }, [autoSave, autoSaveInterval, content, initialValue, onSave]);
  
  // Update character count
  const updateCharCount = (text) => {
    if (showCharCount) {
      setCharCount(text.length);
    }
  };
  
  // Handle content changes
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    updateCharCount(newContent);
    
    if (onChange) {
      onChange(newContent);
    }
  };
  
  // Toggle preview mode
  const togglePreview = () => {
    setPreview(!preview);
  };
  
  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };
  
  // Insert markdown syntax
  const insertMarkdown = (syntax, placeholder = '', selectionOffset = 0) => {
    if (readOnly) return;
    
    const textarea = editorRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let insertion;
    if (selectedText) {
      insertion = syntax.replace(placeholder, selectedText);
    } else {
      insertion = syntax;
    }
    
    const newContent = 
      textarea.value.substring(0, start) + 
      insertion + 
      textarea.value.substring(end);
    
    setContent(newContent);
    updateCharCount(newContent);
    
    if (onChange) {
      onChange(newContent);
    }
    
    // Set cursor position
    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.selectionStart = start;
        textarea.selectionEnd = start + insertion.length;
      } else {
        const newCursorPos = start + selectionOffset;
        textarea.selectionStart = newCursorPos;
        textarea.selectionEnd = newCursorPos;
      }
    }, 0);
  };
  
  // Toolbar button handlers
  const handleHeading = (level) => {
    const prefix = '#'.repeat(level) + ' ';
    insertMarkdown(prefix + 'placeholder', 'placeholder', prefix.length);
  };
  
  const handleBold = () => insertMarkdown('**placeholder**', 'placeholder', 2);
  const handleItalic = () => insertMarkdown('*placeholder*', 'placeholder', 1);
  const handleBulletList = () => insertMarkdown('- placeholder\n', 'placeholder', 2);
  const handleOrderedList = () => insertMarkdown('1. placeholder\n', 'placeholder', 3);
  const handleQuote = () => insertMarkdown('> placeholder', 'placeholder', 2);
  const handleCode = () => insertMarkdown('```\nplaceholder\n```', 'placeholder', 4);
  const handleInlineCode = () => insertMarkdown('`placeholder`', 'placeholder', 1);
  
  // Handle link insertion
  const handleLink = () => {
    insertMarkdown('[placeholder](url)', 'placeholder', 1);
  };
  
  // Handle image insertion
  const handleImage = () => {
    insertMarkdown('![alt text](image-url)', 'alt text', 2);
  };
  
  // Handle alignment (using HTML since Markdown doesn't support alignment)
  const handleAlignLeft = () => insertMarkdown('<div style="text-align: left">placeholder</div>', 'placeholder', 31);
  const handleAlignCenter = () => insertMarkdown('<div style="text-align: center">placeholder</div>', 'placeholder', 33);
  const handleAlignRight = () => insertMarkdown('<div style="text-align: right">placeholder</div>', 'placeholder', 32);
  
  // Export markdown as .md file
  const handleExport = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Render markdown to HTML
  const renderMarkdown = () => {
    if (!content) return '';
    
    try {
      const rawHtml = marked(content);
      const sanitizedHtml = DOMPurify.sanitize(rawHtml);
      return sanitizedHtml;
    } catch (error) {
      console.error('Error rendering markdown:', error);
      return '<p>Error rendering markdown</p>';
    }
  };
  
  // Markdown help guide
  const MarkdownHelp = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Markdown Guide</h2>
            <button 
              onClick={() => setShowHelpModal(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Headings</h3>
              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                <code className="text-sm"># Heading 1</code><br />
                <code className="text-sm">## Heading 2</code><br />
                <code className="text-sm">### Heading 3</code>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Formatting</h3>
              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                <code className="text-sm">**Bold text**</code><br />
                <code className="text-sm">*Italic text*</code><br />
                <code className="text-sm">`Inline code`</code>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Lists</h3>
              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                <code className="text-sm">- Unordered item</code><br />
                <code className="text-sm">1. Ordered item</code>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Links & Images</h3>
              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                <code className="text-sm">[Link text](https://example.com)</code><br />
                <code className="text-sm">![Alt text](image-url.jpg)</code>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Blockquotes & Code Blocks</h3>
              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                <code className="text-sm">> This is a quote</code><br />
                <code className="text-sm">```<br />Code block<br />```</code>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-right">
            <button
              onClick={() => setShowHelpModal(false)}
              className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <div 
      className={`markdown-editor ${fullscreen ? 'fixed inset-0 z-40 bg-white dark:bg-gray-900 p-4' : ''} ${className}`}
    >
      {/* Toolbar */}
      {showToolbar && !readOnly && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-2">
            {/* Headings */}
            <div className="relative group">
              <button
                type="button"
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                title="Headings"
              >
                <Heading1 className="w-4 h-4" />
              </button>
              <div className="absolute hidden group-hover:block bg-white dark:bg-gray-800 shadow-lg rounded-md z-10 mt-1 border dark:border-gray-700">
                <button 
                  type="button" 
                  onClick={() => handleHeading(1)} 
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Heading1 className="h-4 w-4 inline mr-2" /> Heading 1
                </button>
                <button 
                  type="button" 
                  onClick={() => handleHeading(2)} 
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Heading2 className="h-4 w-4 inline mr-2" /> Heading 2
                </button>
                <button 
                  type="button" 
                  onClick={() => handleHeading(3)} 
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Heading3 className="h-4 w-4 inline mr-2" /> Heading 3
                </button>
              </div>
            </div>
            
            {/* Text formatting */}
            <button
              type="button"
              onClick={handleBold}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title="Bold"
              aria-label="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleItalic}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title="Italic"
              aria-label="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            
            {/* Lists */}
            <button
              type="button"
              onClick={handleBulletList}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title="Bullet List"
              aria-label="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleOrderedList}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title="Numbered List"
              aria-label="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            
            {/* Alignment */}
            {!isMobile && (
              <div className="relative group">
                <button
                  type="button"
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                  title="Text Alignment"
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <div className="absolute hidden group-hover:block bg-white dark:bg-gray-800 shadow-lg rounded-md z-10 mt-1 border dark:border-gray-700">
                  <button 
                    type="button" 
                    onClick={handleAlignLeft} 
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <AlignLeft className="h-4 w-4 inline mr-2" /> Left
                  </button>
                  <button 
                    type="button" 
                    onClick={handleAlignCenter} 
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <AlignCenter className="h-4 w-4 inline mr-2" /> Center
                  </button>
                  <button 
                    type="button" 
                    onClick={handleAlignRight} 
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <AlignRight className="h-4 w-4 inline mr-2" /> Right
                  </button>
                </div>
              </div>
            )}
            
            {/* Block formatting */}
            <button
              type="button"
              onClick={handleQuote}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title="Quote"
              aria-label="Quote"
            >
              <Quote className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleCode}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title="Code Block"
              aria-label="Code Block"
            >
              <Code className="w-4 h-4" />
            </button>
            
            {/* Media */}
            <button
              type="button"
              onClick={handleLink}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title="Insert Link"
              aria-label="Insert Link"
            >
              <Link className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleImage}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title="Insert Image"
              aria-label="Insert Image"
            >
              <Image className="w-4 h-4" />
            </button>
            
            <div className="border-r border-gray-300 dark:border-gray-700 mx-1 h-6 self-center" />
            
            {/* View controls */}
            {showPreview && (
              <button
                type="button"
                onClick={togglePreview}
                className={`p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors ${preview ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                title={preview ? 'Edit' : 'Preview'}
                aria-label={preview ? 'Edit' : 'Preview'}
              >
                {preview ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            )}
            
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title={fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              aria-label={fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            
            <button
              type="button"
              onClick={() => setShowHelpModal(true)}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title="Markdown Help"
              aria-label="Markdown Help"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            
            <button
              type="button"
              onClick={handleExport}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              title="Export Markdown"
              aria-label="Export Markdown"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      
      <div className="relative">
        {/* Editor */}
        {!preview && (
          <textarea
            ref={editorRef}
            value={content}
            onChange={handleContentChange}
            placeholder={placeholder}
            className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono"
            style={{ 
              minHeight, 
              maxHeight: fullscreen ? 'calc(100vh - 180px)' : maxHeight,
              resize: 'vertical',
            }}
            readOnly={readOnly}
            aria-label="Markdown editor"
          />
        )}
        
        {/* Preview */}
        {preview && (
          <div 
            ref={previewRef}
            className="w-full p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 overflow-auto prose dark:prose-invert max-w-none"
            style={{ 
              minHeight, 
              maxHeight: fullscreen ? 'calc(100vh - 180px)' : maxHeight,
            }}
            dangerouslySetInnerHTML={{ __html: renderMarkdown() }}
          />
        )}
      </div>
      
      {/* Character Count */}
      {showCharCount && (
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-right">
          {charCount} characters
          {maxCharCount && (
            <span> / {maxCharCount} {charCount > maxCharCount && (
              <span className="text-red-500">({charCount - maxCharCount} over limit)</span>
            )}</span>
          )}
        </div>
      )}
      
      {/* Help Modal */}
      {showHelpModal && <MarkdownHelp />}
    </div>
  );
};

export default MarkdownEditor;