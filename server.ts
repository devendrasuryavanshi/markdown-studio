import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import puppeteer from "puppeteer";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Parse JSON bodies
  app.use(express.json({ limit: '50mb' }));

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/export-pdf", async (req, res) => {
    try {
      const { html, theme, styles } = req.body;
      
      if (!html) {
        return res.status(400).json({ error: "HTML content is required" });
      }

      const isDark = theme === 'dark';
      const bgColor = isDark ? '#0f0f12' : '#ffffff';
      const textColor = isDark ? '#e0e0e6' : '#1a1a1a';
      const codeBg = isDark ? '#282c34' : '#f5f5f5';
      const borderColor = isDark ? '#2d2d35' : '#ddd';

      const fullHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              /* Pure CSS without any Tailwind or oklch */
              * { box-sizing: border-box; }
              body { 
                padding: 40px; 
                background-color: ${bgColor}; 
                color: ${textColor}; 
                font-family: ${styles?.fontFamily || 'Inter'}, sans-serif; 
                font-size: ${styles?.baseFontSize || 16}px; 
                line-height: 1.6; 
                margin: 0;
                max-width: 210mm;
              }
              #pdf-content {
                max-width: 100%;
                overflow: hidden;
              }
              table { border-collapse: collapse; width: 100%; max-width: 100%; margin-bottom: 1em; table-layout: fixed; }
              th, td { border: 1px solid ${borderColor}; padding: 8px; text-align: left; word-wrap: break-word; overflow-wrap: break-word; word-break: break-word; }
              blockquote { border-left: 4px solid ${borderColor}; margin: 0 0 1em 0; padding-left: 16px; opacity: 0.8; }
              pre, div { max-width: 100% !important; }
              pre { background-color: ${codeBg} !important; padding: 16px; border-radius: 8px; white-space: pre-wrap !important; word-wrap: break-word !important; overflow-wrap: break-word !important; word-break: break-word !important; margin-bottom: 1em; max-width: 100% !important; overflow: hidden !important; }
              code { font-family: monospace; white-space: pre-wrap !important; word-wrap: break-word !important; overflow-wrap: break-word !important; word-break: break-word !important; }
              span { white-space: pre-wrap !important; word-wrap: break-word !important; overflow-wrap: break-word !important; }
              a { color: #4f46e5; text-decoration: none; }
              h1, h2, h3, h4, h5, h6 { font-family: ${styles?.headingFontFamily || 'Inter'}, sans-serif; margin-top: 1.5em; margin-bottom: 0.5em; font-weight: 600; line-height: 1.2; word-wrap: break-word; }
              h1 { font-size: 2em; border-bottom: 1px solid ${borderColor}; padding-bottom: 0.3em; }
              h2 { font-size: 1.5em; border-bottom: 1px solid ${borderColor}; padding-bottom: 0.3em; }
              h3 { font-size: 1.25em; }
              p { margin-top: 0; margin-bottom: 1em; word-wrap: break-word; overflow-wrap: break-word; }
              ul, ol { margin-top: 0; margin-bottom: 1em; padding-left: 2em; }
              img { max-width: 100%; height: auto; }
              hr { height: 1px; border: none; background-color: ${borderColor}; margin: 2em 0; }
            </style>
          </head>
          <body>
            <div id="pdf-content">
              ${html}
            </div>
          </body>
        </html>
      `;

      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true
      });
      
      const page = await browser.newPage();
      await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true
      });
      
      await browser.close();

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=export.pdf');
      res.send(Buffer.from(pdfBuffer));
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).json({ error: 'Failed to generate PDF' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
