// Simple script to check what's wrong
import('./src/main.jsx').catch(e => console.error('IMPORT ERROR:', e.message));
