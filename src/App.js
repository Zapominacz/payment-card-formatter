import React from 'react';
import { onCardInputChange } from './cardFormatter';
class App extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      input: {
        text: '',
        selectionStart: 0,
        selectionEnd: 0,
      },
    };
    this.ref = null;
  }

  componentDidUpdate() {
    if (this.ref) {
      this.ref.selectionStart = this.state.input.selectionStart;
      this.ref.selectionEnd = this.state.input.selectionEnd;
    }
  }

  onChange = (e) => {
    const text = e.target.value;
    const selectionEnd = e.target.selectionEnd;
    const selectionStart = e.target.selectionStart;
    this.setState({ input: onCardInputChange({ text, selectionStart, selectionEnd }, true) });
  }

  render() {
    return (
      <div className="App">
        <input ref={ref => this.ref = ref} type="text" value={this.state.input.text} onChange={this.onChange} />
      </div>
    );
  }
}

export default App;
