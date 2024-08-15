import { ClosePopupHandler } from './close-popup.handler';
import { CloseSelectionHandler } from './close-selection.handler';
import { ConfirmSelectionHandler } from './confirm-selection.handler';
import { GenericHandler } from './generic.handler';
import { KeyHandler } from './key-handler.model';
import { NextSelectionHandler } from './next-selection.handler';
import { PreviousSelectionHandler } from './previous-selection.handler';

export const KeyHandlerFactory = ({ key, ctrlKey }: KeyboardEvent) => {
  const serializeKey = (key: string, ctrlKey: boolean): string =>
    `${key}_${ctrlKey}`;

  const keyMap: Record<string, KeyHandler> = {
    [serializeKey('ArrowDown', false)]: NextSelectionHandler,
    [serializeKey('ArrowUp', false)]: PreviousSelectionHandler,
    [serializeKey('Enter', false)]: ConfirmSelectionHandler,
    [serializeKey('x', true)]: CloseSelectionHandler,
    [serializeKey('Escape', false)]: ClosePopupHandler,
  };

  return keyMap[serializeKey(key, ctrlKey)] || GenericHandler;
};
