import { filter, fromEvent } from 'rxjs';
import { Popup } from './components/popup/popup';

declare global {
  interface Window {
    handleinput: (e: KeyboardEvent) => void;
  }
}

const activeCommands = {
  f: false,
};

const keyboardEvent$ = fromEvent<KeyboardEvent>(document, 'keydown').pipe(
  filter(
    ({ key }) =>
      key !== 'Escape' &&
      !(document.activeElement instanceof HTMLInputElement) &&
      !(document.activeElement instanceof HTMLTextAreaElement),
  ),
);

// keyboardEvent$
//   .pipe(filter(({ key }) => key === 'f' && !activeCommands.f))
//   .subscribe(() => {
//     activeCommands.f = true;
//     const highlighter = new Highlighter(keyboardEvent$);
//     highlighter.highlight(() => (activeCommands.f = false));
//   });

// keyboardEvent$
//   .pipe(
//     filter(({ key }) => key === 'j'),
//     throttleTime(400),
//   )
//   .subscribe(() => {
//     window.scrollBy({ top: 100, behavior: 'smooth' });
//   });
// keyboardEvent$.pipe(filter(({ key }) => key === 'k')).subscribe(() => {
//   window.scrollBy({ top: -100, behavior: 'smooth' });
// });

keyboardEvent$.pipe(filter(({ key }) => key === 'T')).subscribe(() => {
  chrome.runtime.sendMessage({ request: 'get-actions' }, (response) => {
    const popup = new Popup();
    popup.setResults(response.actions);
    document.body.appendChild(popup);
  });
});
