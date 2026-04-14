export class Layout {
  title: string;
  content: string;

  constructor(title: string, content: string) {
    this.title = title;
    this.content = content;
  }

  render(): string {
    return `
      <html>
        <head>
          <title>${this.title}</title>
          <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        </head>
        <body>
          <nav class="bg-gray-800 pl-6 pr-6 py-4 pb-4">
            <div class="flex items-center justify-between mx-auto">
              <a href="/endpoints" class="text-white text-lg font-semibold">Mock API Studio</a>
              <div>
                <a href="/endpoints" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Endpoints</a>
              </div>
            </div>
          </nav>
          ${this.content}
        </body>
      </html>
    `;
  }
}