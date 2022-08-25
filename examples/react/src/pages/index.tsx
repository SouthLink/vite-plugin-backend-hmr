import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import Child from '../components/child';

const App: FC = () => {
  return (
    <div>
      <p>this is app.tsx</p>
      <Child />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));