import { mapMethodToColor } from "../helpers/helpers";
import { EndpointModel } from "../models/endpoint.model";

export class EndpointShowView {
  endpoint: EndpointModel;

  constructor(endpoint: EndpointModel) {
    this.endpoint = endpoint;
  }

  render(): string {
    return `
      <section class="p-6">
        <a href="/endpoints" class="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Endpoints</a>
        <h1 class="text-2xl font-semibold text-slate-900">${this.endpoint.name}</h1>
        <p class="mt-1 text-sm text-slate-600">Details for the ${this.endpoint.method} ${this.endpoint.path} endpoint.</p>
        <div class="mt-4 bg-gray-50 p-4 rounded-md">
          <dl class="">
            <div class="mb-4">
              <dt class="text-sm font-medium text-slate-500">Method</dt>
              <dd class="mt-1 text-sm text-slate-900 ${mapMethodToColor(this.endpoint.method)} px-2 py-1 rounded-md text-xs font-medium inline-block">
                ${this.endpoint.method}
              </dd>
            </div>
            <div class="mb-4">
              <dt class="text-sm font-medium text-slate-500">Path</dt>
              <dd class="mt-1 text-sm text-slate-900 font-mono">${this.endpoint.path}</dd>
            </div>
            <div class="mb-4">
              <dt class="text-sm font-medium text-slate-500">Request Body</dt>
              <dd class="mt-1 text-sm text-slate-900">
                <pre class="bg-gray-100 p-2 rounded-md overflow-x-auto"><code>${this.endpoint.body || 'No body defined'}</code></pre>
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-slate-500">Active</dt>
              <dd class="mt-1 text-sm text-slate-900">${this.endpoint.active ? 'Yes' : 'No'}</dd>
            </div>
          </dl>
        </div>
      </section>
    `;
  }
}