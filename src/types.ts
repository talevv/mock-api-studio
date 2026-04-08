type HTTPMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options';

export interface Route {
  method: HTTPMethod;
  path: string;
  handler: (req: any, res: any) => void;
}

export interface Controller {
  routing: Route[];
}