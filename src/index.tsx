import { WeElement, render, h, tag } from 'omi'

import './o-counter'
import './index.css'
import './o-transfer'
import * as css from './index.less'
import logo from './logo.svg'

interface MyAppProps {
  name: string
}

let arr = new Array();
for (let i = 1; i <= 20; ++i) {
  arr.push({ key: i, table: i });
}

@tag('my-app')
export default class extends WeElement<MyAppProps> {

  static css = css.default

  abc: string

  onCountChanged = (evt: CustomEvent) => {
    console.log(evt.detail)
  }

  render(props) {
    return (
      <div class="app">
        <o-transfer data={[{ key: 1, table: '1', disable: true }, { key: 2, table: '2' }, { key: 3, table: '3' }, { key: 4, table: '4' }, { key: 5, table: '5', disable: true }]} value={[1]} titles={["标题a" , "标题b"]}></o-transfer>
      </div>
    )
  }
}

render(<my-app></my-app>, '#root', {
  // if using OMI to build the whole application, ignore the attributs of DOM and use props of virtual dom
  ignoreAttrs: true
})
