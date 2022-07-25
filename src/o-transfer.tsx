import { tag, h, WeElement, OverwriteProps, o } from 'omi'

import * as css from './o-transfer.scss'
import '@omiu/checkbox'
import '@omiu/button'

export type Attrs = {
    data?: [];
    value: [];
}

const tagName = 'o-transfer'


class Native {
    constructor(table: String, key: number, disable?: Boolean) {
        this.table = table;
        this.key = key;
        this.disable = typeof disable == "undefined" ? false : disable;
    }
    table: String
    key: number
    disable: Boolean
}

export type Props = OverwriteProps<Attrs, { count: Number, data: Array<Native>, value: Array<Number>, titles?: Array<String>, bechlick1: Array<Number>, bechlick2: Array<Number> }>
// interface Props {
//     data: Array<Native>,
//     value: Array<Number>, 
//     titles?: Array<String>, 
//     bechlick1: Array<Number>, 
//     bechlick2: Array<Number>
// }

@tag(tagName)
export default class Transfer extends WeElement<Props> {
    static css = css.default ? css.default : css

    static defaultProps = {
        data: [],
        value: [],
        titles: ["列表1", "列表2"],
        bechlick1: [],
        bechlick2: [],
    }

    static propTypes = {
        data: Array<Native>,
        value: Array<Number>,
        title: Array<String>,
        bechlick1: Array<Number>,
        bechlick2: Array<Number>,
    }

    // 根据key值寻找在数组中的下标
    findIndex = (key: Number, arr: Array<Native>) => {
        let ans = -1;
        arr.forEach((item, index) => {
            if (item.key == key) {
                ans = index;
            }
        })
        return ans;
    }

    // 获取可以被点击的左边的lable数量
    getDataNumber = () => {
        let number = 0;
        this.props.data.map(item => {
            if (this.props.value.indexOf(item.key) == -1 && ('disable' in item && item.disable)) {
                number++;
            }
        })
        return this.props.data.length - this.props.value.length - number;
    }

    // 获取可以被点击的右边的lable数量
    getValueNumber = () => {
        let number = 0;
        this.props.data.map(item => {
            if (this.props.value.indexOf(item.key) != -1 && ('disable' in item && item.disable)) {
                number++;
            }
        })
        return this.props.value.length - number;
    }

    // 左边的label被点击
    labelClick = (key: Number) => {
        if (this.props.bechlick1.indexOf(key) == -1) {
            this.props.bechlick1.push(key);
        }
        else {
            this.props.bechlick1.splice(this.props.bechlick1.indexOf(key), 1);
        }
        this.update();
    }

    // 右边的label被点击
    valueLableChilck = (key: Number) => {
        if (this.props.bechlick2.indexOf(key) == -1) {
            this.props.bechlick2.push(key);
        }
        else {
            this.props.bechlick2.splice(this.props.bechlick2.indexOf(key), 1);
        }
        this.update();
    }

    // 中间第一个按钮
    arrowChick = () => {
        while (this.props.bechlick2.length) {
            this.props.bechlick2.pop();
            this.props.value.pop();
        }
        this.update();
    }

    // 中间第二个按钮
    forwardChick = () => {
        while (this.props.bechlick1.length) {
            this.props.value.push(this.props.bechlick1[this.props.bechlick1.length - 1]);
            this.props.bechlick1.pop();
        }
        this.update();
    }

    // 全选左边的label 考虑不能为disable 
    SelectAll = () => {
        if (this.props.bechlick1.length < this.getDataNumber()) {
            this.props.data.map((item, index) => {
                if (this.props.value.indexOf(item.key) == -1 && this.props.bechlick1.indexOf(item.key) == -1 && (!('disable' in this.props.data[index]) || this.props.data[index].disable != true)) {
                    this.props.bechlick1.push(item.key);
                }
            })
        }
        else {
            while (this.props.bechlick1.length) {
                this.props.bechlick1.pop();
            }
        }
        this.update();
    }

    // 全选右边的label 考虑不能为disable 
    SelectValueAll = () => {
        if (this.props.bechlick2.length < this.getValueNumber()) {
            this.props.value.map(item => {
                if (this.props.bechlick2.indexOf(item) == -1 && (!('disable' in this.props.data[this.findIndex(item, this.props.data)]) || this.props.data[this.findIndex(item, this.props.data)].disable != true)) {
                    this.props.bechlick2.push(item);
                }
            })
        }
        else {
            while (this.props.bechlick2.length) {
                this.props.bechlick2.pop();
            }
        }
        this.update();
    }

    judgeDataChecked = () => {
        return this.getDataNumber() != 0 && this.getDataNumber() == this.props.bechlick1.length;
    }

    judgeDataindeterminate = () => {
        return this.props.bechlick1.length > 0 && this.getDataNumber() > this.props.bechlick1.length;
    }

    judgeValueChecked = () => {
        return this.getValueNumber() != 0 && this.getValueNumber() == this.props.bechlick2.length;
    }

    judgeValueindeterminate = () => {
        return this.props.bechlick2.length > 0 && this.getValueNumber() > this.props.bechlick2.length
    }

    render(props: Props) {
        return (
            // <h.f></h.f> or <></> are supported
            <h.f>
                <div class="transferBox">
                    <div class="transferBoxHeader">
                        <o-checkbox label={props.titles[0]} checked={this.judgeDataChecked()} indeterminate={this.judgeDataindeterminate()} onchange={this.SelectAll}></o-checkbox>
                    </div>

                    <ul>
                        {
                            props.data.map(item => {
                                return props.value.indexOf(item.key) === -1 && <li ><o-checkbox label={item.table} disabled={item.disable} checked={props.bechlick1.indexOf(item.key) != -1} onChange={() => this.labelClick(item.key)} ></o-checkbox></li>
                            })
                        }
                    </ul>
                </div>
                <div class="transferButton">
                    <div class="transferButtonBody">
                        <o-button type="primary" onClick={this.arrowChick}>&lt;</o-button>
                        <o-button type="primary" onClick={this.forwardChick}>&gt;</o-button>
                    </div>
                </div>
                <div class="transferBox">
                    <div class="transferBoxHeader">
                        <o-checkbox label={props.titles[1]} checked={this.judgeValueChecked()} indeterminate={this.judgeValueindeterminate()} onchange={this.SelectValueAll}></o-checkbox>
                    </div>
                    <ul>
                        {
                            props.data.map(item => {
                                return props.value.indexOf(item.key) !== -1 && <li><o-checkbox label={item.table} disabled={item.disable} onChange={() => this.valueLableChilck(item.key)} checked={props.bechlick2.indexOf(item.key) != -1}></o-checkbox></li>
                            }
                            )}
                    </ul>
                </div>
            </h.f>
        )
    }
}