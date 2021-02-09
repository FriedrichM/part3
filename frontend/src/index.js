import ReactDOM from 'react-dom'
import App from './App'
import './index.css';

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
