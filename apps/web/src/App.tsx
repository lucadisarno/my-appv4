import { Routes, Route } from "react-router-dom"

function Home() {
  return <h1 className="text-2xl font-medium p-8">Home</h1>
}

function Login() {
  return <h1 className="text-2xl font-medium p-8">Login</h1>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}
