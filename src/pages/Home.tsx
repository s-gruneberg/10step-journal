// pages/Home.tsx
import Questions from '../components/Questions'

export default function Home() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-1">Inventory</h1>
      <hr className="w-full h-0.5 bg-gray-300 rounded-sm mb-5" />

      <Questions />
    </>
  )
}
