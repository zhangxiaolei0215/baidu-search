import React from 'react'
import ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.css'
import jsonp from 'jsonp'
//思路
//react思想状态state控制数据
// 1 样式
// 2 用户输入表单，查询联想列表，通过百度的接口
// 3 用户点击回车时，打开一个新的页面进行搜索
// 4 鼠标滑上联想列表时，当前列表item高亮，并且列表item的内容回填到表单中
// 5 按上下键时，可以切换，联想列表的高亮
// 6 点击联想列表的某一项，进行搜索，打开一个新的页面进行搜索


function JSONP(url, opt) {
    return new Promise(function (resolve, reject) {
        jsonp(url, opt, function (err, data) {
            if (err) {
                reject(err);
                return;
            }
            resolve(data);
        })
    })
}

let sty = {
    marginTop: '30px'
}

class App extends React.Component {
    constructor() {
        super()
        this.state = {
            list: [],//联想的列表
            curIndex: -1, //标志，控制列表中的那一项是高亮
            keyword: "" //input输入框内容——关键字
        }
    }

    //onChange事件绑定
    handleChange = async (e) => {
        const keyword = e.target.value;
        // await JSONP("https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=" + keyword, {param: "cb"}).then((data) => {
        //     console.log(data);
        //     this.setState({
        //         list: data.s
        //     })
        // })

        const data = await JSONP("https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=" + keyword, {param: "cb"});
        // console.log(data);
        this.setState({
            list: data.s,
            keyword: keyword
        })
    }

    //enter键盘跳转页面
    handleKeyUp = (e) => {
        // 只有是回车键时跳转
        if (e.keyCode == 13) {
            // 发起请求，获取搜索的结果
            window.open("http://www.baidu.com?wd=" + e.target.value)
        } else if (e.keyCode == 38) {
            console.log('--------上--------')
            let curIndex = this.state.curIndex - 1;
            if (curIndex < -1) {
                curIndex = this.state.list.length - 1
            }

            this.setState({
                curIndex: curIndex,
                keyword: this.state.list[curIndex] || ""
            })
        } else if (e.keyCode == 40) {
            console.log('--------下--------')
            let curIndex = this.state.curIndex + 1;
            if (curIndex > this.state.list.length - 1) {
                curIndex = 0
            }
            this.setState({
                curIndex: curIndex,
                keyword: this.state.list[curIndex] || ""
            })
        }
    }

    // 鼠标滑过li设置高亮
    handleListOver = (index, item) => {
        this.setState({
            curIndex: index,
            // keyword: this.state.list[index]
            keyword: item
        })
        // console.log(this.state.list[index])
    }

    //点击li跳转
    listClick = (keyword) => {
        console.log(keyword)
        window.open("http://www.baidu.com?wd=" + keyword)
    }

    render() {
        return <div className="container col-md-6 col-md-offset=3" style={sty}>
            <div className="input-group">
                <input type="text"
                       className="form-control"
                       placeholder="搜索一下"
                       onChange={this.handleChange}
                       onKeyUp={this.handleKeyUp}
                       value={this.state.keyword}
                />
                <span className="input-group-btn">
                    <button className="btn btn-default"
                            type="button">Go!
                    </button>
                </span>
            </div>
            <ul className="list-group">
                {this.state.list.map((item, index) => {
                    return <li className={this.state.curIndex == index ? "list-group-item active" : "list-group-item"}
                               key={index}
                               onMouseOver={this.handleListOver.bind(this, index, item)}
                               onClick={() => this.listClick(item)}
                    >{item}</li>
                })}
            </ul>
        </div>
    }
}

ReactDOM.render(<App/>, document.getElementById('root'))





