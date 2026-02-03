import * as fs from 'fs';
import * as path from 'path';

// Use dynamic import for pdf-parse since it's an ES module
let pdfParse: any;

/**
 * Utility class for PDF operations
 */
export class PDFUtil {
  /**
   * Initialize the PDF parser
   */
  private static async initPdfParse() {
    if (!pdfParse) {
      pdfParse = (await import('pdf-parse')).default;
    }
    return pdfParse;
  }

  /**
   * Extract text content from a PDF file
   * @param filePath - Path to the PDF file
   * @returns Extracted text content
   */
  static async extractTextFromPDF(filePath: string): Promise<string> {
    const parse = await this.initPdfParse();
    
    // Ensure the file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`PDF file not found: ${filePath}`);
    }

    // Read the PDF file
    const dataBuffer = fs.readFileSync(filePath);
    
    // Parse the PDF
    const data = await parse(dataBuffer);
    
    return data.text;
  }

  /**
   * Check if PDF content contains specific text
   * @param filePath - Path to the PDF file
   * @param searchText - Text to search for (case-insensitive)
   * @returns True if text is found
   */
  static async containsText(filePath: string, searchText: string): Promise<boolean> {
    const content = await this.extractTextFromPDF(filePath);
    return content.toLowerCase().includes(searchText.toLowerCase());
  }

  /**
   * Verify if PDF is a Gas plan
   * @param filePath - Path to the PDF file
   * @returns True if it's a Gas plan
   */
  static async isGasPlan(filePath: string): Promise<boolean> {
    const content = await this.extractTextFromPDF(filePath);
    const lowerContent = content.toLowerCase();
    
    // Check for Gas-related keywords
    const gasKeywords = [
      'gas plan',
      'natural gas',
      'gas supply',
      'gas energy',
      'gas only',
      'reticulated gas',
      'gas service'
    ];

    // Check if any gas keyword is present
    const hasGasKeyword = gasKeywords.some(keyword => lowerContent.includes(keyword));
    
    // Additional check: should not be exclusively an electricity plan
    const electricityOnly = lowerContent.includes('electricity only') || 
                           (lowerContent.includes('electricity') && !lowerContent.includes('gas'));
    
    return hasGasKeyword && !electricityOnly;
  }

  /**
   * Get PDF metadata and basic info
   * @param filePath - Path to the PDF file
   */
  static async getPDFInfo(filePath: string): Promise<any> {
    const parse = await this.initPdfParse();
    const dataBuffer = fs.readFileSync(filePath);
    const data = await parse(dataBuffer);
    
    return {
      numPages: data.numpages,
      info: data.info,
      metadata: data.metadata,
      version: data.version,
      textLength: data.text.length
    };
  }

  /**
   * Create downloads directory if it doesn't exist
   */
  static ensureDownloadsDirectory(): void {
    const downloadsDir = path.join(process.cwd(), 'downloads');
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
    }
  }
}
