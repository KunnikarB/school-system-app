import Login from './components/Login'
import './index.css'

function App() {
  

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Login
          onLogin={() => {
            alert('Login button clicked')
          }}
          onAdminLinkClick={() => {
            alert('Admin link clicked')
          }}
        />
      </div>
    </>
  )
}

export default App
