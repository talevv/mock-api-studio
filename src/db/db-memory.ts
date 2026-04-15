const endpointsDbRows = [
  { id: '1', name: 'Get Users', path: '/users', method: 'GET', body: '', active: true },
  { id: '2', name: 'Create User', path: '/users', method: 'POST', body: '{"name": "John Doe"}', active: false },
  { id: '3', name: 'Update User', path: '/users/:id', method: 'PUT', body: '{"name": "John Doe Updated"}', active: false },
  { id: '4', name: 'Delete User', path: '/users/:id', method: 'DELETE', body: '', active: false },
];


export class DbMemory {
  private endpoints: any[] = [
    ...endpointsDbRows.slice() // create a copy of the initial data
  ];

  getAll() {
    return this.endpoints;
  }

  getById(id: string) {
    return this.endpoints.find(endpoint => endpoint.id === id) || null;
  }

  save(endpoint: any) {
    this.endpoints.push(endpoint);
  }

  activate(ids: string[]) {
    this.endpoints = this.endpoints.map(endpoint => ({
      ...endpoint,
      active: ids.includes(endpoint.id)
    }));
    return this.endpoints;
  }

  delete(id: string) {
    this.endpoints = this.endpoints.filter(endpoint => endpoint.id !== id);
  }

  update(id: string, data: any) {
    this.endpoints = this.endpoints.map(endpoint => {
      if (endpoint.id === id) {
        return { ...endpoint, ...data };
      }
      return endpoint;
    });
  }
}

export const memoryDb = new DbMemory();