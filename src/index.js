import React from 'react';
import ReactDOM from 'react-dom';
import FormComponent from './FormComponent';

class App extends React.Component {
    render() {
      
      return (
        <div className="ui masthead vertical segment">
          <FormComponent />
        </div>
      )
    }
}

ReactDOM.render(
  <App />,
  document.querySelector("#root")  
);