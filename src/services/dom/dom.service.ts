import { map, of } from 'rxjs'
import { QuakVimPanelMode } from '../../models/quak-vim-panel-mode.model'
import { searchableElementAdapter } from './adapters/searchable-element.adapter'

export const DomService = {
  links$: (mode: QuakVimPanelMode) => {
    const elements = document.querySelectorAll(
      'a, input, button, select, textarea',
    )

    return of(elements).pipe(
      map((items) =>
        Array.from(items).map((item) => searchableElementAdapter(item, mode)),
      ),
    )
  },
}
