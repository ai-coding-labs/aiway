import { contextBridge, ipcRenderer } from 'electron';

// Define the API interface
interface ElectronAPI {
  loadUrl: (url: string) => Promise<{ success: boolean; url?: string; error?: string }>;
  analyzeAiFlavor: (webviewId: string) => Promise<{ success: boolean; result?: any; error?: string }>;
  captureScreenshot: (webviewId: string) => Promise<{ success: boolean; screenshot?: Buffer; error?: string }>;
  saveDetectionRecord: (data: {
    analysisResult: any;
    url: string;
    title: string;
    screenshotBuffer: Buffer;
    metadata: any;
  }) => Promise<{ success: boolean; recordId?: string; error?: string }>;
  getRecords: () => Promise<{ success: boolean; records?: any[]; error?: string }>;
  getRecordById: (id: string) => Promise<{ success: boolean; record?: any; error?: string }>;
  deleteRecord: (id: string) => Promise<{ success: boolean; error?: string }>;
  searchRecords: (query: string) => Promise<{ success: boolean; records?: any[]; error?: string }>;
  clearAllRecords: () => Promise<{ success: boolean; error?: string }>;
  getScreenshot: (screenshotPath: string) => Promise<{ success: boolean; imageData?: string; error?: string }>;
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
const electronAPI: ElectronAPI = {
  loadUrl: (url: string) => ipcRenderer.invoke('load-url', url),
  analyzeAiFlavor: (webviewId: string) => ipcRenderer.invoke('analyze-ai-flavor', webviewId),
  captureScreenshot: (webviewId: string) => ipcRenderer.invoke('capture-screenshot', webviewId),
  saveDetectionRecord: (data: {
    analysisResult: any;
    url: string;
    title: string;
    screenshotBuffer: Buffer;
    metadata: any;
  }) => ipcRenderer.invoke('save-detection-record', data),
  getRecords: () => ipcRenderer.invoke('get-records'),
  getRecordById: (id: string) => ipcRenderer.invoke('get-record-by-id', id),
  deleteRecord: (id: string) => ipcRenderer.invoke('delete-record', id),
  searchRecords: (query: string) => ipcRenderer.invoke('search-records', query),
  clearAllRecords: () => ipcRenderer.invoke('clear-all-records'),
  getScreenshot: (screenshotPath: string) => ipcRenderer.invoke('get-screenshot', screenshotPath)
};

// Expose the API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

// Type declaration for TypeScript
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
