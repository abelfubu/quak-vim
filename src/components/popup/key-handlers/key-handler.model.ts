interface HandlerParams<T> {
  data: T[];
  total: T[];
  index: number;
  searchTerm: string;
  callback?: () => void;
}
export interface KeyHandler {
  handle<
    T extends { id?: number; title?: string; url?: string; li: HTMLLIElement },
  >(
    params: HandlerParams<T>,
  ): { data: T[]; index: number };
}
