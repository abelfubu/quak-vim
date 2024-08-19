import { PopupType } from './popup-type.model';

export type PopupData = {
  id?: number;
  favIconUrl?: string;
  title?: string;
  url?: string;
  active?: boolean;
  type: 'tab' | 'history';
  li?: HTMLLIElement;
  mode: PopupType;
};
