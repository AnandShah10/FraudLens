// vite.config.mts
import { defineConfig } from "file:///C:/Users/Admin/OneDrive%20-%20JMS%20Advisory%20Services%20Private%20Limited/Desktop/chrome%20extensions/scam-website-risk-meter/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Admin/OneDrive%20-%20JMS%20Advisory%20Services%20Private%20Limited/Desktop/chrome%20extensions/scam-website-risk-meter/node_modules/@vitejs/plugin-react/dist/index.js";
import tailwindcss from "file:///C:/Users/Admin/OneDrive%20-%20JMS%20Advisory%20Services%20Private%20Limited/Desktop/chrome%20extensions/scam-website-risk-meter/node_modules/@tailwindcss/vite/dist/index.mjs";
import path from "path";
import fs from "fs";
var __vite_injected_original_dirname = "C:\\Users\\Admin\\OneDrive - JMS Advisory Services Private Limited\\Desktop\\chrome extensions\\scam-website-risk-meter";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "rename-html-outputs",
      closeBundle() {
        const distDir = path.resolve(__vite_injected_original_dirname, "dist");
        const mappings = [
          { from: path.join(distDir, "src", "popup", "index.html"), to: path.join(distDir, "popup.html") },
          { from: path.join(distDir, "src", "options", "index.html"), to: path.join(distDir, "options.html") }
        ];
        for (const { from, to } of mappings) {
          if (fs.existsSync(from)) {
            let content = fs.readFileSync(from, "utf8");
            content = content.replace(/src="\/([^"]+)"/g, 'src="./$1"');
            content = content.replace(/href="\/([^"]+)"/g, 'href="./$1"');
            fs.writeFileSync(to, content, "utf8");
            fs.rmSync(from);
            console.log(`[rename-html] moved ${path.basename(from)} \u2192 ${path.basename(to)}`);
          }
        }
        try {
          const srcPopup = path.join(distDir, "src", "popup");
          const srcOptions = path.join(distDir, "src", "options");
          const srcDir = path.join(distDir, "src");
          if (fs.existsSync(srcPopup)) fs.rmdirSync(srcPopup);
          if (fs.existsSync(srcOptions)) fs.rmdirSync(srcOptions);
          if (fs.existsSync(srcDir)) fs.rmdirSync(srcDir);
        } catch (_) {
        }
      }
    }
  ],
  build: {
    rollupOptions: {
      input: {
        popup: "src/popup/index.html",
        options: "src/options/index.html",
        background: "src/background/index.ts",
        content: "src/content/index.ts"
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]"
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcQWRtaW5cXFxcT25lRHJpdmUgLSBKTVMgQWR2aXNvcnkgU2VydmljZXMgUHJpdmF0ZSBMaW1pdGVkXFxcXERlc2t0b3BcXFxcY2hyb21lIGV4dGVuc2lvbnNcXFxcc2NhbS13ZWJzaXRlLXJpc2stbWV0ZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEFkbWluXFxcXE9uZURyaXZlIC0gSk1TIEFkdmlzb3J5IFNlcnZpY2VzIFByaXZhdGUgTGltaXRlZFxcXFxEZXNrdG9wXFxcXGNocm9tZSBleHRlbnNpb25zXFxcXHNjYW0td2Vic2l0ZS1yaXNrLW1ldGVyXFxcXHZpdGUuY29uZmlnLm10c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvQWRtaW4vT25lRHJpdmUlMjAtJTIwSk1TJTIwQWR2aXNvcnklMjBTZXJ2aWNlcyUyMFByaXZhdGUlMjBMaW1pdGVkL0Rlc2t0b3AvY2hyb21lJTIwZXh0ZW5zaW9ucy9zY2FtLXdlYnNpdGUtcmlzay1tZXRlci92aXRlLmNvbmZpZy5tdHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSAnQHRhaWx3aW5kY3NzL3ZpdGUnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICB0YWlsd2luZGNzcygpLFxuICAgIHtcbiAgICAgIG5hbWU6ICdyZW5hbWUtaHRtbC1vdXRwdXRzJyxcbiAgICAgIGNsb3NlQnVuZGxlKCkge1xuICAgICAgICAvLyBBZnRlciBidW5kbGUgaXMgd3JpdHRlbiwgbW92ZSBIVE1MIGZpbGVzIGZyb20gZGlzdC9zcmMvKiB0byBkaXN0L1xuICAgICAgICBjb25zdCBkaXN0RGlyID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ2Rpc3QnKTtcbiAgICAgICAgY29uc3QgbWFwcGluZ3MgPSBbXG4gICAgICAgICAgeyBmcm9tOiBwYXRoLmpvaW4oZGlzdERpciwgJ3NyYycsICdwb3B1cCcsICdpbmRleC5odG1sJyksIHRvOiBwYXRoLmpvaW4oZGlzdERpciwgJ3BvcHVwLmh0bWwnKSB9LFxuICAgICAgICAgIHsgZnJvbTogcGF0aC5qb2luKGRpc3REaXIsICdzcmMnLCAnb3B0aW9ucycsICdpbmRleC5odG1sJyksIHRvOiBwYXRoLmpvaW4oZGlzdERpciwgJ29wdGlvbnMuaHRtbCcpIH0sXG4gICAgICAgIF07XG4gICAgICAgIGZvciAoY29uc3QgeyBmcm9tLCB0byB9IG9mIG1hcHBpbmdzKSB7XG4gICAgICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoZnJvbSkpIHtcbiAgICAgICAgICAgIGxldCBjb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKGZyb20sICd1dGY4Jyk7XG4gICAgICAgICAgICAvLyBGaXggYWJzb2x1dGUgcGF0aHMgdG8gcmVsYXRpdmUgcGF0aHMgZm9yIENocm9tZSBleHRlbnNpb24gY29tcGF0aWJpbGl0eVxuICAgICAgICAgICAgY29udGVudCA9IGNvbnRlbnQucmVwbGFjZSgvc3JjPVwiXFwvKFteXCJdKylcIi9nLCAnc3JjPVwiLi8kMVwiJyk7XG4gICAgICAgICAgICBjb250ZW50ID0gY29udGVudC5yZXBsYWNlKC9ocmVmPVwiXFwvKFteXCJdKylcIi9nLCAnaHJlZj1cIi4vJDFcIicpO1xuICAgICAgICAgICAgZnMud3JpdGVGaWxlU3luYyh0bywgY29udGVudCwgJ3V0ZjgnKTtcbiAgICAgICAgICAgIGZzLnJtU3luYyhmcm9tKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbcmVuYW1lLWh0bWxdIG1vdmVkICR7cGF0aC5iYXNlbmFtZShmcm9tKX0gXHUyMTkyICR7cGF0aC5iYXNlbmFtZSh0byl9YCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFJlbW92ZSBlbXB0eSBzcmMvIHN1YmRpcnNcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCBzcmNQb3B1cCA9IHBhdGguam9pbihkaXN0RGlyLCAnc3JjJywgJ3BvcHVwJyk7XG4gICAgICAgICAgY29uc3Qgc3JjT3B0aW9ucyA9IHBhdGguam9pbihkaXN0RGlyLCAnc3JjJywgJ29wdGlvbnMnKTtcbiAgICAgICAgICBjb25zdCBzcmNEaXIgPSBwYXRoLmpvaW4oZGlzdERpciwgJ3NyYycpO1xuICAgICAgICAgIGlmIChmcy5leGlzdHNTeW5jKHNyY1BvcHVwKSkgZnMucm1kaXJTeW5jKHNyY1BvcHVwKTtcbiAgICAgICAgICBpZiAoZnMuZXhpc3RzU3luYyhzcmNPcHRpb25zKSkgZnMucm1kaXJTeW5jKHNyY09wdGlvbnMpO1xuICAgICAgICAgIGlmIChmcy5leGlzdHNTeW5jKHNyY0RpcikpIGZzLnJtZGlyU3luYyhzcmNEaXIpO1xuICAgICAgICB9IGNhdGNoIChfKSB7fVxuICAgICAgfVxuICAgIH1cbiAgXSxcbiAgYnVpbGQ6IHtcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBpbnB1dDoge1xuICAgICAgICBwb3B1cDogJ3NyYy9wb3B1cC9pbmRleC5odG1sJyxcbiAgICAgICAgb3B0aW9uczogJ3NyYy9vcHRpb25zL2luZGV4Lmh0bWwnLFxuICAgICAgICBiYWNrZ3JvdW5kOiAnc3JjL2JhY2tncm91bmQvaW5kZXgudHMnLFxuICAgICAgICBjb250ZW50OiAnc3JjL2NvbnRlbnQvaW5kZXgudHMnXG4gICAgICB9LFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnW25hbWVdLmpzJyxcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdhc3NldHMvW25hbWVdLVtoYXNoXS5qcycsXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzOiAnYXNzZXRzL1tuYW1lXS1baGFzaF0uW2V4dF0nXG4gICAgICB9XG4gICAgfVxuICB9XG59KTsiXSwKICAibWFwcGluZ3MiOiAiO0FBQW1pQixTQUFTLG9CQUFvQjtBQUNoa0IsT0FBTyxXQUFXO0FBQ2xCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sVUFBVTtBQUNqQixPQUFPLFFBQVE7QUFKZixJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUEsSUFDWjtBQUFBLE1BQ0UsTUFBTTtBQUFBLE1BQ04sY0FBYztBQUVaLGNBQU0sVUFBVSxLQUFLLFFBQVEsa0NBQVcsTUFBTTtBQUM5QyxjQUFNLFdBQVc7QUFBQSxVQUNmLEVBQUUsTUFBTSxLQUFLLEtBQUssU0FBUyxPQUFPLFNBQVMsWUFBWSxHQUFHLElBQUksS0FBSyxLQUFLLFNBQVMsWUFBWSxFQUFFO0FBQUEsVUFDL0YsRUFBRSxNQUFNLEtBQUssS0FBSyxTQUFTLE9BQU8sV0FBVyxZQUFZLEdBQUcsSUFBSSxLQUFLLEtBQUssU0FBUyxjQUFjLEVBQUU7QUFBQSxRQUNyRztBQUNBLG1CQUFXLEVBQUUsTUFBTSxHQUFHLEtBQUssVUFBVTtBQUNuQyxjQUFJLEdBQUcsV0FBVyxJQUFJLEdBQUc7QUFDdkIsZ0JBQUksVUFBVSxHQUFHLGFBQWEsTUFBTSxNQUFNO0FBRTFDLHNCQUFVLFFBQVEsUUFBUSxvQkFBb0IsWUFBWTtBQUMxRCxzQkFBVSxRQUFRLFFBQVEscUJBQXFCLGFBQWE7QUFDNUQsZUFBRyxjQUFjLElBQUksU0FBUyxNQUFNO0FBQ3BDLGVBQUcsT0FBTyxJQUFJO0FBQ2Qsb0JBQVEsSUFBSSx1QkFBdUIsS0FBSyxTQUFTLElBQUksQ0FBQyxXQUFNLEtBQUssU0FBUyxFQUFFLENBQUMsRUFBRTtBQUFBLFVBQ2pGO0FBQUEsUUFDRjtBQUVBLFlBQUk7QUFDRixnQkFBTSxXQUFXLEtBQUssS0FBSyxTQUFTLE9BQU8sT0FBTztBQUNsRCxnQkFBTSxhQUFhLEtBQUssS0FBSyxTQUFTLE9BQU8sU0FBUztBQUN0RCxnQkFBTSxTQUFTLEtBQUssS0FBSyxTQUFTLEtBQUs7QUFDdkMsY0FBSSxHQUFHLFdBQVcsUUFBUSxFQUFHLElBQUcsVUFBVSxRQUFRO0FBQ2xELGNBQUksR0FBRyxXQUFXLFVBQVUsRUFBRyxJQUFHLFVBQVUsVUFBVTtBQUN0RCxjQUFJLEdBQUcsV0FBVyxNQUFNLEVBQUcsSUFBRyxVQUFVLE1BQU07QUFBQSxRQUNoRCxTQUFTLEdBQUc7QUFBQSxRQUFDO0FBQUEsTUFDZjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxlQUFlO0FBQUEsTUFDYixPQUFPO0FBQUEsUUFDTCxPQUFPO0FBQUEsUUFDUCxTQUFTO0FBQUEsUUFDVCxZQUFZO0FBQUEsUUFDWixTQUFTO0FBQUEsTUFDWDtBQUFBLE1BQ0EsUUFBUTtBQUFBLFFBQ04sZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsTUFDbEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
