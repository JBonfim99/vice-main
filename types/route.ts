export type RouteParams<T> = {
  params: Promise<T>;
};

export type PageParams<T> = {
  params: T;
};
