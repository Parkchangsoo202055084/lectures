import React from "react";

class LifecycleDemo extends React.Component {
  constructor(props) {
    super(props);
    // constructor(): 컴포넌트가 생성될 때 호출됩니다.
    // console.log("constructor");
    this.state = {
      count: 0,
      hasError: false,
    };
  }

  // componentDidMount(): 컴포넌트가 처음으로 DOM에 마운트된 직후에 호출됩니다.
  componentDidMount() {
    console.log("componentDidMount");
    // 예: 네트워크 요청이나 타이머 설정 등의 작업
  }

  // shouldComponentUpdate(): 컴포넌트가 리렌더링되어야 할지 결정합니다.
  shouldComponentUpdate(nextProps, nextState) {
    console.log("shouldComponentUpdate");
    // 예: 상태가 변경될 때만 리렌더링
    return nextState.count !== this.state.count;
  }

  // componentDidUpdate(): 컴포넌트가 리렌더링된 직후에 호출됩니다.
  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("componentDidUpdate");
    // 예: 상태 변경 후 추가 작업
  }

  // componentWillUnmount(): 컴포넌트가 DOM에서 제거되기 직전에 호출됩니다.
  componentWillUnmount() {
    console.log("componentWillUnmount");
    // 예: 타이머 해제나 네트워크 요청 취소 등의 작업
  }

  // 이벤트 핸들러
  handleIncrement = () => {
    this.setState({ count: this.state.count + 1 });
  };

  // render(): 컴포넌트의 UI를 정의합니다.
  render() {
    console.log("render");

    return (
      <div>
        <h1>React Lifecycle Methods Demo</h1>
        <p>Count: {this.state.count}</p>
        <button onClick={this.handleIncrement}>증가</button>
        <button onClick={() => alert("다른 컴포넌트로 이동하도록 구현 필요")}>
          componentWillUnmount
        </button>
      </div>
    );
  }
}

export default LifecycleDemo;
